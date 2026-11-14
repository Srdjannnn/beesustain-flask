# BeeSustain klon (Flask)

Praksa demonstracija: responsivni frontend i Flask backend. Forma za novosti proverava email i čuva prijave u SQLite bazi `subscriptions.db`. Stilovi su razdvojeni u `css/` po delovima sajta: osnova, navigacija, uvod, proces, tehnologija, uticaj, publika, podnožje i prikaz na manjim ekranima.

## Lokalno pokretanje

Potrebni su Python 3.10 ili noviji.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Otvori `http://127.0.0.1:5000`. Baza se kreira automatski pri pokretanju. Putanju baze možeš promeniti promenljivom `BEESUSTAIN_DATABASE`.

## API za prijavu

`POST /api/subscribe` prima JSON kao `{"email":"ime@example.com"}`. Odgovor sadrži `ok` i poruku; neispravan email vraća HTTP 400. Duplikati se tretiraju kao uspešna prijava, a adrese se čuvaju u lokalnoj SQLite bazi.

## Hostovanje

Za Python hosting postavi fajlove projekta, instaliraj zavisnosti iz `requirements.txt` i pokreni WSGI aplikaciju preko `app:app` (Gunicorn komanda: `gunicorn app:app`). SQLite fajl mora biti na trajnom, upisivom mestu. Dostupnost Python aplikacija i WSGI podešavanja zavisi od konkretnog Hostinger paketa.

Za produkciju podesi trajnu putanju baze i koristi HTTPS. Forma je demo: nije povezana sa email servisom, a prijave se trenutno čuvaju u bazi.
