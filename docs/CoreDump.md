Disable core dumb 
```bash
sudo mkdir -p /etc/systemd/coredump.conf.d
printf '[Coredump]\nStorage=none\nProcessSizeMax=0\n' | sudo tee /etc/systemd/coredump.conf.d/99-disable.conf
sudo systemctl daemon-reload
```