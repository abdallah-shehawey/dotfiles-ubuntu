#!/usr/bin/env bash
# antigravity-update - install or update Antigravity IDE, wherever it lives.
#
# The install directory is discovered, never assumed: from PATH, from the
# desktop entry, or from the usual prefixes. If the IDE is not installed at
# all, you are asked whether to install it and where.
set -euo pipefail

VERSION="1.3.0"
PROGRAM="${0##*/}"

DOWNLOAD_URL="https://antigravity.google/download"
DEFAULT_INSTALL_DIR="/usr/share/antigravity-ide"
# Only used when nothing is installed and the user does not choose otherwise.
USER_INSTALL_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/antigravity-ide"

install_dir="${ANTIGRAVITY_INSTALL_DIR:-}"
check_only=false
dry_run=false
keep_archive=false
force=false
assume_yes=false
desktop_only=false
no_desktop=false

usage() {
  cat <<USAGE
${PROGRAM} - install or update Antigravity IDE, wherever it lives

USAGE:
    ${PROGRAM} [OPTIONS]

DESCRIPTION:
    Finds an existing Antigravity IDE installation and updates it in place. The
    location is discovered rather than assumed: from the launcher on your PATH,
    from the installed desktop entry, then from the usual prefixes.

    If nothing is installed, you are asked whether to install it, and where.

    After installing, the desktop entry, the icon and the /usr/local/bin
    launchers are refreshed, so the application shows up properly in the
    activities overview instead of as a nameless generic window.

OPTIONS:
    -c, --check          Report installed and available versions, then exit
    -d, --dir PATH       Use this install directory instead of discovering one
    -n, --dry-run        Do everything except write to the install directory
    -f, --force          Reinstall even when the installed version is current
    -k, --keep           Keep the downloaded archive
    -y, --yes            Do not ask anything; install to the default location
                         if nothing is installed
        --desktop        Only rebuild the desktop entry, icon and launchers
        --no-desktop     Update the files but leave desktop integration alone
    -V, --version        Print version and exit
    -h, --help           Show this help and exit

EXIT STATUS:
    0   up to date, or installed/updated successfully
    1   something went wrong
    2   bad usage or a missing dependency
    3   with --check: an update is available
    4   with --check: not installed

ENVIRONMENT:
    ANTIGRAVITY_INSTALL_DIR   Same as --dir.
USAGE
}

info() { printf '%s\n' "$*"; }
warn() { printf '%s: %s\n' "$PROGRAM" "$*" >&2; }
die()  { printf '%s: %s\n' "$PROGRAM" "$1" >&2; exit "${2:-1}"; }

# --------------------------------------------------------------------------
# Privilege: only reach for sudo when the target really is not ours to write.
# --------------------------------------------------------------------------
as_root() {
  if [ -w "${1:-/}" ] && [ "$(id -u)" -ne 0 ]; then
    shift; "$@"
  elif [ "$(id -u)" -eq 0 ]; then
    shift; "$@"
  else
    shift
    command -v sudo >/dev/null 2>&1 || die "need root for this and sudo is not installed" 2
    sudo "$@"
  fi
}

needs_root() {
  local target="$1"
  [ "$(id -u)" -eq 0 ] && return 1
  # Writable if the directory exists and is writable, or its parent is.
  if [ -d "$target" ]; then [ -w "$target" ] && return 1
  else [ -w "$(dirname "$target")" ] && return 1
  fi
  return 0
}

run_priv() {
  local target="$1"; shift
  if needs_root "$target"; then
    command -v sudo >/dev/null 2>&1 || die "need root to write $target and sudo is not installed" 2
    sudo "$@"
  else
    "$@"
  fi
}

# --------------------------------------------------------------------------
# Discovery
# --------------------------------------------------------------------------
is_install_dir() { [ -f "$1/resources/app/product.json" ]; }

# Walk up from a path until a directory looks like an installation.
climb_to_install_dir() {
  local d="$1"
  d="$(cd "$(dirname -- "$d")" 2>/dev/null && pwd)" || return 1
  while [ -n "$d" ] && [ "$d" != "/" ]; do
    is_install_dir "$d" && { printf '%s\n' "$d"; return 0; }
    d="$(dirname "$d")"
  done
  return 1
}

desktop_dirs() {
  printf '%s\n' \
    "${XDG_DATA_HOME:-$HOME/.local/share}/applications" \
    /usr/local/share/applications \
    /usr/share/applications
}

discover_install_dir() {
  local candidate resolved dir file exec_path

  # 1. Whatever the launcher on PATH points at.
  for candidate in antigravity antigravity-ide; do
    resolved="$(command -v "$candidate" 2>/dev/null)" || continue
    resolved="$(readlink -f "$resolved" 2>/dev/null)" || continue
    dir="$(climb_to_install_dir "$resolved")" && { printf '%s\n' "$dir"; return 0; }
  done

  # 2. The Exec line of an installed desktop entry.
  while IFS= read -r d; do
    [ -d "$d" ] || continue
    for file in "$d"/*antigravity*.desktop; do
      [ -f "$file" ] || continue
      exec_path="$(awk -F= '/^Exec=/ { print $2; exit }' "$file" | awk '{ print $1 }')"
      [ -n "$exec_path" ] || continue
      dir="$(climb_to_install_dir "$exec_path")" && { printf '%s\n' "$dir"; return 0; }
    done
  done < <(desktop_dirs)

  # 3. The usual prefixes.
  for dir in \
      /usr/share/antigravity-ide /usr/share/antigravity \
      /usr/local/share/antigravity-ide /opt/antigravity-ide /opt/antigravity \
      /opt/Antigravity "$USER_INSTALL_DIR"; do
    is_install_dir "$dir" && { printf '%s\n' "$dir"; return 0; }
  done

  return 1
}

installed_version() {
  jq -r '.ideVersion // empty' "$1/resources/app/product.json" 2>/dev/null || true
}

# --------------------------------------------------------------------------
# Desktop integration
# --------------------------------------------------------------------------
# Where a .desktop for this install belongs: beside the install if it is
# system-wide, in the user's own directory if the install is under $HOME.
desktop_target_dir() {
  case "$1" in
    "$HOME"/*) printf '%s\n' "${XDG_DATA_HOME:-$HOME/.local/share}/applications" ;;
    *)         printf '%s\n' "/usr/share/applications" ;;
  esac
}

icon_target_dir() {
  case "$1" in
    "$HOME"/*) printf '%s\n' "${XDG_DATA_HOME:-$HOME/.local/share}/icons/hicolor/512x512/apps" ;;
    *)         printf '%s\n' "/usr/share/icons/hicolor/512x512/apps" ;;
  esac
}

install_desktop_integration() {
  local dir="$1"
  local exec_bin="$dir/antigravity-ide"
  [ -x "$exec_bin" ] || exec_bin="$dir/antigravity"
  [ -x "$exec_bin" ] || { warn "no launcher binary found in $dir, skipping desktop integration"; return 0; }

  local apps_dir icons_dir icon_src icon_name="antigravity"
  apps_dir="$(desktop_target_dir "$dir")"
  icons_dir="$(icon_target_dir "$dir")"

  # The app ships its own icon; find it rather than guessing a filename.
  icon_src=""
  for candidate in \
      "$dir/resources/app/resources/linux/code.png" \
      "$dir/resources/app/resources/linux/antigravity.png" \
      "$dir/resources/app/resources/linux"/*.png; do
    [ -f "$candidate" ] && { icon_src="$candidate"; break; }
  done

  if [ "$dry_run" = true ]; then
    info "would write ${apps_dir}/antigravity-ide.desktop"
    [ -n "$icon_src" ] && info "would install icon from ${icon_src}"
    return 0
  fi

  if [ -n "$icon_src" ]; then
    run_priv "$icons_dir" mkdir -p "$icons_dir"
    run_priv "$icons_dir" cp -f "$icon_src" "${icons_dir}/${icon_name}.png"
    run_priv "$icons_dir" chmod 0644 "${icons_dir}/${icon_name}.png"
    # /usr/share/pixmaps is the fallback for desktops that ignore hicolor.
    case "$dir" in
      "$HOME"/*) ;;
      *) run_priv /usr/share/pixmaps mkdir -p /usr/share/pixmaps
         run_priv /usr/share/pixmaps cp -f "$icon_src" "/usr/share/pixmaps/${icon_name}.png"
         run_priv /usr/share/pixmaps chmod 0644 "/usr/share/pixmaps/${icon_name}.png" ;;
    esac
  else
    warn "no icon found inside $dir; the launcher will use a generic one"
  fi

  run_priv "$apps_dir" mkdir -p "$apps_dir"
  local tmp_desktop; tmp_desktop="$(mktemp)"
  cat > "$tmp_desktop" <<DESKTOP
[Desktop Entry]
Name=Antigravity
Comment=Experience liftoff
GenericName=Text Editor
Exec=${exec_bin} %F
Icon=${icon_name}
Type=Application
StartupNotify=false
StartupWMClass=antigravity-ide
Categories=TextEditor;Development;IDE;
MimeType=application/x-antigravity-workspace;inode/directory;text/plain;
Keywords=antigravity;ide;editor;code;
Actions=new-empty-window;

[Desktop Action new-empty-window]
Name=New Empty Window
Exec=${exec_bin} --new-window %F
Icon=${icon_name}
DESKTOP
  run_priv "$apps_dir" install -m 0644 "$tmp_desktop" "${apps_dir}/antigravity-ide.desktop"
  rm -f "$tmp_desktop"

  # URL handler, so antigravity:// links open the IDE.
  local tmp_url; tmp_url="$(mktemp)"
  cat > "$tmp_url" <<DESKTOP
[Desktop Entry]
Name=Antigravity - URL Handler
Comment=Experience liftoff
GenericName=Text Editor
Exec=${exec_bin} --open-url %U
Icon=${icon_name}
Type=Application
NoDisplay=true
StartupNotify=true
Categories=Utility;TextEditor;Development;IDE;
MimeType=x-scheme-handler/antigravity;
Keywords=antigravity;
DESKTOP
  run_priv "$apps_dir" install -m 0644 "$tmp_url" "${apps_dir}/antigravity-url-handler.desktop"
  rm -f "$tmp_url"

  # Command-line launchers.
  local cli="$dir/bin/antigravity-ide"
  if [ -x "$cli" ]; then
    local bindir="/usr/local/bin"
    case "$dir" in "$HOME"/*) bindir="$HOME/.local/bin" ;; esac
    run_priv "$bindir" mkdir -p "$bindir"
    run_priv "$bindir" ln -sfn "$cli" "${bindir}/antigravity"
    run_priv "$bindir" ln -sfn "$cli" "${bindir}/antigravity-ide"
  fi

  command -v update-desktop-database >/dev/null 2>&1 && \
    run_priv "$apps_dir" update-desktop-database "$apps_dir" >/dev/null 2>&1 || true
  command -v gtk-update-icon-cache >/dev/null 2>&1 && \
    run_priv "$icons_dir" gtk-update-icon-cache -qtf "${icons_dir%/512x512/apps}" >/dev/null 2>&1 || true

  info "desktop entry, icon and launchers refreshed"
}

# --------------------------------------------------------------------------
# Arguments
# --------------------------------------------------------------------------
while [ $# -gt 0 ]; do
  case "$1" in
    -c|--check)    check_only=true; shift ;;
    -d|--dir)      [ -n "${2:-}" ] || die "--dir needs a path" 2; install_dir="$2"; shift 2 ;;
    -n|--dry-run)  dry_run=true; shift ;;
    -f|--force)    force=true; shift ;;
    -k|--keep)     keep_archive=true; shift ;;
    -y|--yes)      assume_yes=true; shift ;;
    --desktop)     desktop_only=true; shift ;;
    --no-desktop)  no_desktop=true; shift ;;
    -V|--version)  echo "${PROGRAM} ${VERSION}"; exit 0 ;;
    -h|--help)     usage; exit 0 ;;
    *)             usage >&2; die "unknown option: $1" 2 ;;
  esac
done

for dep in curl jq tar rsync; do
  command -v "$dep" >/dev/null 2>&1 || die "$dep is not installed" 2
done

# --------------------------------------------------------------------------
# Locate the installation
# --------------------------------------------------------------------------
fresh_install=false
if [ -n "$install_dir" ]; then
  is_install_dir "$install_dir" || fresh_install=true
elif install_dir="$(discover_install_dir)"; then
  :
else
  install_dir=""
  fresh_install=true
fi

if [ "$desktop_only" = true ]; then
  [ "$fresh_install" = false ] || die "Antigravity IDE is not installed, nothing to point a desktop entry at"
  info "install : $install_dir"
  install_desktop_integration "$install_dir"
  exit 0
fi

LOCAL=""
[ "$fresh_install" = false ] && LOCAL="$(installed_version "$install_dir")"

# Answer --check for a machine without the IDE before going near the network:
# callers like update-every-thing(1) use this to decide whether the step is
# relevant at all, and it should not cost them a page fetch.
if [ "$check_only" = true ] && [ "$fresh_install" = true ]; then
  info "installed : not installed"
  echo "not installed"
  exit 4
fi

# --------------------------------------------------------------------------
# What is available
# --------------------------------------------------------------------------
case "$(uname -m)" in
  x86_64)        ARCH="linux-x64" ;;
  aarch64|arm64) ARCH="linux-arm" ;;
  *)             die "unsupported architecture: $(uname -m)" 2 ;;
esac

URL="$(curl -sL --compressed "$DOWNLOAD_URL" \
  | grep -oiP "href=\"\Khttps://edgedl[^\"]*${ARCH}/Antigravity[^\"]*\.tar\.gz" \
  | head -n1)" || true
[ -n "$URL" ] || die "could not find a ${ARCH} download link on ${DOWNLOAD_URL}"
REMOTE="$(grep -oP 'stable/\K[0-9]+\.[0-9]+\.[0-9]+' <<<"$URL" | head -n1)"

if [ "$fresh_install" = true ]; then
  info "installed : not installed"
else
  info "installed : ${LOCAL:-unknown}   (${install_dir})"
fi
info "available : ${REMOTE}"

up_to_date=false
if [ "$fresh_install" = false ] && [ -n "$LOCAL" ] && \
   [ "$(printf '%s\n%s\n' "$LOCAL" "$REMOTE" | sort -V | tail -n1)" = "$LOCAL" ]; then
  up_to_date=true
fi

if [ "$check_only" = true ]; then
  if [ "$fresh_install" = true ]; then echo "not installed"; exit 4; fi
  if [ "$up_to_date" = true ]; then echo "up to date"; exit 0; fi
  echo "an update is available"
  exit 3
fi

# --------------------------------------------------------------------------
# Ask before a first install, and about where it should go
# --------------------------------------------------------------------------
if [ "$fresh_install" = true ]; then
  if [ -z "$install_dir" ]; then
    if [ "$assume_yes" = true ]; then
      install_dir="$DEFAULT_INSTALL_DIR"
    else
      printf '\nAntigravity IDE is not installed on this system.\n'
      printf 'Install version %s now? [y/N] ' "$REMOTE"
      read -r reply </dev/tty || reply=""
      case "$reply" in
        [yY]|[yY][eE][sS]) ;;
        *) info "nothing to do"; exit 0 ;;
      esac

      printf 'Install to [%s] (enter for default): ' "$DEFAULT_INSTALL_DIR"
      read -r chosen </dev/tty || chosen=""
      install_dir="${chosen:-$DEFAULT_INSTALL_DIR}"
    fi
  fi
  info "installing into ${install_dir}"
elif [ "$up_to_date" = true ] && [ "$force" = false ]; then
  info "already up to date, nothing to do"
  [ "$no_desktop" = true ] || install_desktop_integration "$install_dir"
  exit 0
fi

# --------------------------------------------------------------------------
# Download, verify, extract
# --------------------------------------------------------------------------
DEST_DIR="${TMPDIR:-$HOME}"
TARBALL="${DEST_DIR}/Antigravity-IDE-${REMOTE}.tar.gz"
info "downloading to ${TARBALL}"
curl -L --fail --retry 5 --retry-delay 2 -C - -o "$TARBALL" "$URL"

# The download is resumable, so a truncated file still exits 0. Check the size
# the server reported before trusting the archive.
REMOTE_SIZE="$(curl -sIL "$URL" | awk 'tolower($1) == "content-length:" { v = $2 } END { gsub(/\r/, "", v); print v }')"
LOCAL_SIZE="$(stat -c%s "$TARBALL")"
if [ -n "$REMOTE_SIZE" ] && [ "$REMOTE_SIZE" != "$LOCAL_SIZE" ]; then
  die "incomplete download (${LOCAL_SIZE}/${REMOTE_SIZE} bytes) - re-run to resume"
fi
tar -tzf "$TARBALL" >/dev/null 2>&1 || die "corrupt archive - delete $TARBALL and re-run"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
info "extracting"
tar -xzf "$TARBALL" -C "$TMP"
SRC="$TMP/Antigravity IDE"
[ -d "$SRC" ] || SRC="$(find "$TMP" -maxdepth 1 -mindepth 1 -type d | head -n1)"
[ -d "$SRC" ] || die "unexpected archive layout"

if [ "$dry_run" = true ]; then
  info "would install ${REMOTE} into ${install_dir}"
  [ "$no_desktop" = true ] || install_desktop_integration "$SRC"
  [ "$keep_archive" = true ] || rm -f "$TARBALL"
  exit 0
fi

# --------------------------------------------------------------------------
# Install
# --------------------------------------------------------------------------
owner=""
needs_root "$install_dir" && owner="--chown=root:root"
run_priv "$install_dir" mkdir -p "$install_dir"

info "installing into ${install_dir}"
# Replace files and drop stale ones, but keep local extras the IDE writes.
# shellcheck disable=SC2086
run_priv "$install_dir" rsync -a --delete $owner \
  --exclude '.claude' --exclude 'antigravity' \
  "$SRC"/ "$install_dir"/

run_priv "$install_dir" ln -sfn antigravity-ide "$install_dir/antigravity"
# The Chromium sandbox must be setuid root or the IDE refuses to start.
if [ -e "$install_dir/chrome-sandbox" ]; then
  run_priv "$install_dir" chown root:root "$install_dir/chrome-sandbox" 2>/dev/null || true
  run_priv "$install_dir" chmod 4755 "$install_dir/chrome-sandbox"
fi

[ "$no_desktop" = true ] || install_desktop_integration "$install_dir"

NEW="$(installed_version "$install_dir")"
info "done, Antigravity IDE is now ${NEW:-unknown}"

if [ "$keep_archive" = true ]; then
  info "archive kept at ${TARBALL}"
else
  rm -f "$TARBALL"
  info "cleaned up the downloaded archive"
fi
