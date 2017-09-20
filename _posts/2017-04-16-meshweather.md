---
layout: post
title:  "meshWeather"
date:   2017-04-14
excerpt: "Un sistema decentralizzato per il monitoraggio del meteo"
project: true
tag:
- ESP8266
- Arduino
- Elettronica
comments: true
feature: /assets/img/post-image/esempio.png
showFeature: true
---
L'idea di questo progetto è la realizzazione di una rete mesh con i circuiti ESP-01. Il network viene poi impiegato per il monitoraggio delle condizione metereologiche in un campo tramite l'utilizzo di stazioni meteo basate su Arduino, ma l'idea si può estendere facilmente con altri utilizzi sostituendo semplicemente i dati raccolti dalle stazioni.

<img src="{{ site.url }}/assets/img/post-image/esempio.png" style="width: 450px !important;"/>

## Hardware
<img src="{{ site.url }}/assets/img/post-image/ESP-01.jpg" align="left"/>
Il progetto è realizzato impiegando tutto hardware a bassissimo costo. Per la rete mesh sono stati impiegati i chip ESP-01 che utilizzano il microcontrollare ESP8266 prodotto dalle EspressIF.

Questo modulo viene, di solito, venduto con il firmware AT preinstallato. Seguendo tuttavia semplici guide online, come ad esempio [questa](https://h3ron.com/post/programmare-lesp8266-ovvero-arduino-con-il-wifi-a-meno-di-2/) è possibile flashare il firmware nodeMCU e scrivere il proprio sketch.

## Costruire la rete mesh
Capito come si fa a caricare il proprio firmware e sketch, abbiamo cercato una libreria che potesse aiutarci trovando [easyMesh](https://github.com/Coopdis/easyMesh), sulla quale stiamo scrivendo il nostro protocollo di comunicazione.

Poichè la rete che andiamo a costruire è statica, cioè i nodi non sono mobili, abbiamo scritto un protocollo di rete ispirato al distance vector che si preoccupa di cercare la strada migliore dalla stazione meteo che emette di dati al server che li analizza. I nodi intermedi si fanno carico di gestire l'instradamento e, in caso di fallimento, di rispedire il pacchetto arrivato fino a loro senza propagare l'errore all'indietro.

## Il circuito per far funzionare il tutto
Per flashare i firmware è stato progettato un circuito che permette di passare dalla modalita bootloading ad una usage, la cui differenza è l'attacco di un pin del debugger seriale.

![]({{ site.url }}/assets/img/post-image/devSerial.png)
*Modalità debugging*
![]({{ site.url }}/assets/img/post-image/usageSerial.png)
*Modalità usage*

Il circuito che permette tutto questo potete trovarlo sulla repository di Friting [qui](http://fritzing.org/projects/esp01-development-board), caricato dall'utente mastroGeppetto.

Il circuito semplificato per il solo utilizzo, pensato per un'utilizzo tramite batteria, potete trovarlo [qui]({{ site.url }}/assets/only-usage.fzz).

## Presentazione del progetto
<iframe src="http://apagiaro.it/mesh" height="450px" width="700px"></iframe>

# Altre idee
Cercando soluzioni per questo progetto mi sono imbattuto in un progetto per la realizzazione di un Wifi-Extender con questo modulo da 2€. Potete approfondire il progetto [sulla pagina]({{ site.url }}/ripetitoreWifiDIY/) in cui ne parlo in maniera più specifica.