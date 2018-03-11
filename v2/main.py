# import numpy as np
# from keras.models import Sequential
# from keras.layers import Dense, Conv2D, Flatten, Dropout
# from keras import optimizers
import os
import csv
import requests
from congress import Congress
import json
import pprint
import smtplib

pp = pprint.PrettyPrinter(indent=4)

# propublica api key: iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5

def getRecentBill(content):
	URL = "https://api.propublica.org/congress/v1/bills/search.json?query=" + content

	PARAMS = {
		"X-API-Key" : "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5"
	}

	r = requests.get(url = URL, headers = {"X-API-Key" : "iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5"})

	#pp.pprint(r.json())

	# f = open('something.json', 'r+')
	# f.write(str(r.json()))

	billid = r.json()["results"][0]["bills"][0]["bill_id"]

	return billid

congress = Congress("iNjfHXFfsKjig0ujma5m5aooz2td8yyb3WJA00H5")

# pelosi = congress.members.get('P000197')

# # pp.pprint(pelosi)


# pelosibill = congress.bills.by_member("P000197")

# #pp.pprint(pelosibill)

states = congress.nominations.by_state("Va")

pp.pprint(states)


# pp.pprint(pelosibill)


id = getRecentBill("medicare")


def sendEmail(subject, msg):

	TO = 'arvindravipati1@gmail.com'
	SUBJECT = subject
	MSG = msg

	gmail_sender = 'arvindravipati1@gmail.com'
	gmail_password = 'aisquith8'

	server = smtplib.SMTP('smtp.gmail.com', 587)
	server.ehlo()
	server.starttls()
	server.login(gmail_sender, gmail_password)
	BODY = "\r\n".join(['To: %s' % TO, 'From: %s' % gmail_sender, 'Subject: %s' % SUBJECT, '', MSG])

	server.sendmail(gmail_sender, [TO], BODY)
	server.quit()


