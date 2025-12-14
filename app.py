from backend.annotations.config.AppConfig import AppConfig
from flask import Flask, render_template

# Initialize Flask app with frontend support
app = Flask(
    __name__,
    template_folder='frontend/templates',
    static_folder='frontend/static',
    static_url_path='/static'
)

# Initialize backend config
AppConfig.init(app)

# Frontend route
@app.route('/')
def index():
    """Serve frontend homepage"""
    return render_template('index.html')

if __name__ == "__main__":
    AppConfig.run(app)
