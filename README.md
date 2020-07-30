# nginx-config with flask
base on : [DigitalOcean: How To Serve Flask Applications with Gunicorn and Nginx on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-18-04)  

**install additional software packages:**  
sudo apt update  
sudo apt upgrade -y  
sudo apt install python3-pip -y  
sudo apt install python3-venv -y  
sudo apt install nginx -y  

**check nginx status:**  
sudo systemctl status nginx  

**create project directory:**  
mkdir ~/myproject  

**setup virtual environment:**  
pushd ~/myproject  
python3 -m venv myprojectenv  
source ./myprojectenv/bin/activate  
pip install wheel  
pip install gunicorn flask  

**create flask app:**  
nano myproject.py  
```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1>Hello from Flask</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0")
```

**check flask is working correctly:**  
python myproject.py  
deactivate  

**create wsgi file:**  
nano wisg.py  
```python
from myproject import app

if __name__ == "__main__":
    app.run()
```

**check gunicorn is working correctly:**  
gunicorn --bind 0.0.0.0:5000 wsgi:app  

deactivate  
popd  

**create service unit file to run gunicorn:**   
sudo nano /etc/systemd/system/myproject.service  
```
[Unit]
Description=Gunicorn instance to serve myproject
After=network.target

[Service]
User=username
Group=www-data
WorkingDirectory=/home/username/myproject
Environment="PATH=/home/username/myproject/myprojectenv/bin"
ExecStart=/home/username/myproject/myprojectenv/bin/gunicorn --workers 3 --bind unix:myproject.sock -m 007 wsgi:app

[Install]
WantedBy=multi-user.target
```

sudo systemctl start myproject  
sudo systemctl enable myproject  

**check service is running correctly:**  
sudo systemctl status myproject  

**create nginx config file:**  
sudo nano /etc/nginx/sites-available/myproject  
```
server {
    listen 80;
    # server_name your_domain www.your_domain;
    # server_name ip-address;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/username/myproject/myproject.sock;
    }
}
```
**remove default link:**  
sudo rm /etc/nginx/sites-enabled/default  

**create symbolic link to enable new configuration file:**  
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled  

**check config file syntax is correct:**  
sudo nginx -t

**restart nginx:**  
sudo systemctl restart nginx  
