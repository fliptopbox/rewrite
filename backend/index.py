from app import app, db
from app.models import User, Article

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Article': Article}


# app.debug=True
# app.run(host='0.0.0.0', port=80)
