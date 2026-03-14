# Fix Missing Application Icons in GNOME Dock (StartupWMClass)

Sometimes applications show the correct icon in the **Applications Menu**, but when you launch them the **GNOME Dock** shows a generic icon instead.
This usually happens because GNOME cannot match the running application window with its `.desktop` file.
The solution is to add the correct **StartupWMClass** value to the `.desktop` file.

---

## Step 1 — Find the WM_CLASS of the running application

1. Press:
    

```bash
Alt + F2
```

2. Type:
    

```bash
lg
```

3. Press **Enter** to open **GNOME Looking Glass**.
    
4. Go to the **Windows** tab.
    
5. Find your application in the list.
    
6. Copy the value shown in:
    

```bash
wmclass
```

Example:

```bash
wmclass: qpdfview.local.qpdfview
```

---

## Step 2 — Edit the .desktop file

Open the application's desktop entry:

```bash
nvim ~/.local/share/applications/appname.desktop
```

Add the following line inside the `[Desktop Entry]` section:

```bash
StartupWMClass=<wmclass>
```

Example:

```bash
StartupWMClass=qpdfview.local.qpdfview
```

---

## Step 3 — Update the desktop database

Run:

```bash
update-desktop-database ~/.local/share/applications
```

Then log out and log back in.

---

## Result

GNOME will now correctly match the running application window with its `.desktop` file.

The correct icon will appear in the **Dock** instead of the generic icon.

---

## Why this happens

GNOME identifies running applications using the **WM_CLASS** or **App ID** of the window.

If it does not match the `.desktop` file, the application becomes **"untracked"**, which causes the dock to display a generic icon.

Adding `StartupWMClass` fixes this mapping.

---

## Example

```bash
[Desktop Entry]
Name=qpdfview
Exec=qpdfview
Icon=qpdfview
StartupWMClass=qpdfview.local.qpdfview
```

---

## Notes

- This issue is common with **Qt applications**.
    
- It may also appear when using **custom icon themes**.
    
- Works on **GNOME with Wayland or X11**.