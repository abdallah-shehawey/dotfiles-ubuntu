# 🔄 update-every-thing

One command that brings the whole Fedora box up to date: the Antigravity IDE,
DNF packages, firmware, Flatpak and the GNOME extension list, then cleans up
after itself.

The script itself lives in this repo at
[`scripts/update-every-thing`](../scripts/update-every-thing) — that file is the
source of truth. This page explains how it behaves; it deliberately does **not**
paste a copy of it, because the copy that used to live here went stale.

---

## ✅ What it does

| # | Step | Notes |
| --- | ---- | ----- |
| 1 | Antigravity IDE | via `antigravity-update.sh`; skipped if that isn't in `PATH` |
| 2 | DNF system packages | the run's one and only metadata refresh |
| 3 | Firmware | `fwupdmgr refresh` then `fwupdmgr update`; skipped if fwupd isn't installed |
| 4 | Flatpak | skipped if Flatpak isn't installed |
| 5 | GNOME extensions | **listing only** — see below |
| 6 | Cleanup | `dnf autoremove` + `dnf clean all`, one attempt each |

**NVIDIA and CUDA packages are excluded by default** (`--exclude=*nvidia*
--exclude=*cuda*`); a driver swap under a running session is not something you
want happening unattended. Pass `--with-nvidia` to include them — that also
prints the installed NVIDIA packages at the end.

**Why step 5 only lists.** RPM-packaged extensions (`gnome-shell-extension-*`)
were already upgraded by step 2. Asking DNF for them a second time just
re-downloads every repo to print *Nothing to do*. Extensions installed from
extensions.gnome.org aren't DNF's to update at all — those come through GNOME
Software.

---

## 📌 Install

```bash
sudo install -m 755 scripts/update-every-thing    /usr/local/bin/
sudo install -m 755 scripts/antigravity-update.sh /usr/local/bin/
```

The second one is optional — without it step 1 just reports itself as skipped.

---

## 🧠 Usage

```bash
update-every-thing                    # normal run, NVIDIA excluded
update-every-thing --with-nvidia      # include NVIDIA/CUDA
update-every-thing -c 3               # give each failing step 3 tries
update-every-thing -h                 # help
```

| Flag | Meaning |
| ---- | ------- |
| `-c N`, `--retries N` | attempts per failing step before giving up on it (default: **5**) |
| `--with-nvidia` | update NVIDIA/CUDA packages too |
| `-h`, `--help` | usage text |

You are asked for your sudo password once, up front. A background keep-alive
refreshes the timestamp every 50s so no prompt can appear halfway through a long
download.

---

## 🔁 Failure handling

**Nothing aborts the run.** A step that fails is retried up to the limit
(2s apart), and if it still won't go through, the script gives up *on that step*
and moves to the next one. So a dead mirror in step 2 no longer costs you the
firmware and Flatpak updates.

Cleanup steps run once each — retrying `autoremove` is pointless.

`Ctrl-C` stops the run, but still reports honestly: the step that was running is
recorded as interrupted and the summary says the run ended early.

### 📋 The summary

Every run ends with a per-step report:

```text
============================================================
📋 Update Summary
============================================================
  ✅ Antigravity IDE Update          succeeded on attempt 1/5
  ✅ DNF System Update               succeeded on attempt 2/5
  ⏭️  Firmware Update                 fwupdmgr not installed
  ❌ Flatpak Update                  gave up after 5 attempt(s), exit 1
  ✅ Cleanup (autoremove)            succeeded on attempt 1/1
------------------------------------------------------------
  3 succeeded · 1 failed · 1 skipped   (retry limit: 5, took 4m 12s)
============================================================
```

**Exit status:** `0` if everything that ran succeeded, `1` if any step failed,
`130` on `Ctrl-C`. That makes it safe to chain or run from a timer.

Note that the summary records *which* step failed and with what exit code, not
the error text — the real output is already on screen right above it. Neither
stream is captured on purpose: DNF and Flatpak draw progress bars on stderr and
size them from the terminal, so piping either one (through `tee`, say) makes
their output come out duplicated and wrapped.

---

## 🧼 Notes

- Fedora needs **RPMFusion** for NVIDIA drivers.
- Safe to run repeatedly.
- Only step 2 refreshes metadata, so back-to-back runs are cheap.

---

## 🟠 Appendix: legacy Ubuntu script

Kept for reference only — **this is not the installed script**, and it has none
of the retry, summary or exit-status behaviour described above.

```bash
#!/bin/bash
# Script: update-every-thing
# Function: Update everything in Ubuntu
# Default: skip NVIDIA drivers
# Option: --with-nvidia

echo "🚀 Starting full Ubuntu update..."

WITH_NVIDIA=false

if [[ "$1" == "--with-nvidia" ]]; then
  WITH_NVIDIA=true
  echo "⚠️ NVIDIA drivers WILL be updated."
else
  echo "⛔ NVIDIA drivers will be skipped."
  sudo apt-mark hold nvidia-driver-* nvidia-dkms-* nvidia-kernel-* libnvidia-* >/dev/null 2>&1
fi

sudo apt update -y
sudo apt upgrade -y
sudo apt full-upgrade -y
sudo apt install -y linux-generic
sudo apt autoremove -y
sudo apt autoclean -y

sudo snap refresh
flatpak update -y

pro security-status || true
sudo pro fix || true

gnome-extensions update || true
sudo ubuntu-drivers autoinstall || true

if [ "$WITH_NVIDIA" = false ]; then
  sudo apt-mark unhold nvidia-driver-* nvidia-dkms-* nvidia-kernel-* libnvidia-* >/dev/null 2>&1
fi

echo "✅ Update finished!"
```

Ubuntu freezes NVIDIA with `apt-mark hold` rather than DNF's `--exclude`.

---

💻 Maintained by **Abdallah**
