FROM python:3.12.1
EXPOSE 5000
WORKDIR /youtube-ext-webserver
COPY requirements.txt .
RUN pip install -r requirements.txt 
COPY . .
CMD [ "flask", "run", "--host", "0.0.0.0" ]