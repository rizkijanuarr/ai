from backend.annotations.config.AppConfig import AppConfig
from flask import Flask
from backend.annotations.config.AppConfig import AppConfig

app = Flask(__name__)
AppConfig.init(app)

if __name__ == "__main__":
    AppConfig.run(app)
