---
layout: post
title:  "Man-in-the-middle per tutti con Bettercap"
date:   2017-08-24
excerpt: "Due/tre cosine spiegate su Bettercap"
tag:
- crittografia
- MITM
- sicurezza
- bettercap
comments: true
feature: https://www.bettercap.org/assets/logo.png
---
Una delle cose che ci si immagina, quando si pensa alla sicurezza informatica, è l'intercettare e modificare il traffico internet di un computer *target* per fare quello che ci occorre.

<div class="notice">
<h3>Attenzione!!!</h3>
Blocchiamoci un attimo prima di fare qualsiasi cosa, se intercettate traffico o vi immettete in una rete di cui non avete l'autorizzazione, state facendo, come dire, un bel reato penale! Ci sono tante cose legali per cui uno potrebbe trovare utile queste cose, come ad esempio:
<ul>
 <li>Reverse engineering per verificare dei protocolli di rete</li>
 <li>Controllare la sicurezza di alcuni dispositivi IoT</li>
 <li>Provare ad analizzare il traffico del network</li>
 <li>NON per hackerare il profilo Facebook del vicino</li>
</ul>
</div>

L'idea di questa guida è spiegare quindi come fare per intercettare il traffico della rete wifi a cui uno è connesso per poi poterlo analizzare in vari modi (e gestire il tutto, magari, tramite delle politiche QoS specifiche). Se non ti serve analizzare le reti potresti comunque trovare questa guida divertente ma, come sempre, occhio a come utilizzi questa cosa!

![Bettercap Logo](https://www.bettercap.org/assets/logo.png)

# Bettercap: potenza e semplicità
Lo strumento che andremo ad utilizzare è Bettercap, sviluppato da [EvilSocket](https://github.com/evilsocket), uno sviluppatore italiano. La descrizione sul ufficiale è 

*BetterCAP is a powerful, flexible and portable tool created to perform various types of MITM attacks against a network, manipulate HTTP, HTTPS and TCP traffic in realtime, sniff for credentials and much more.*

Insomma, è un bell'oggettino per fare man-in-the-middle (MITM) con pochi comandi da terminale, nel mio caso, divertirsi un po' tra coinquilini e farsi *code injection* a vicenda.

A questo punto, se ne sai un pochino di reti, vai direttamente sul [sito ufficiale](https://www.bettercap.org) che ti risulterà più veloce di questa guida, altrimenti continua pure...

![Network Layers](https://www.cyberciti.biz/media/new/tips/2007/08/linux-internet-model-network-stack.gif)

# Come sono fatte le reti
Innanzitutto occorre dire qualche cosina sulle reti. Parlavo con un mio amico che mi chiedeva __se, analizzando le onde radio che passavano vicino al mio computer, fossi in grado di vedere cosa gli altri stessero facendo.__

Ma certo... Aprite Wireshark, analizzate i pacchetti wifi e... E chiaramente non vedete nulla di interessante, solo numeri e lettere a caso! Questo perchè, fortunatamente, tutto il traffico che il nostro pc scambia con il router è per lo più cifrato. Dico per lo più perchè poi dipende da 3000 fattori, ma la maggior parte dei router che usiamo, utilizzano come metodo di sicurezza della password il protocollo WPA-qualcosa e quindi il traffico è cifrato.

"Ah, bene!", ha detto il mio amico, __"Allora basta conoscere la password del router e puoi leggere tutto...".__ E ancora no! Il problema è che questi nuovi protocolli di sicurezza fanno in modo che una volta che il computer si è connesso alla rete wifi, crei una password unica tra lui e il router ed usi quella, proprio per evitare che qualcu'altro della rete intercetti il traffico. 

E allora come fa Bettercap a fare intereccetare il tutto al computer su cui è eseguito? __Bettercap riesce forzare il computer del mio coinquilino a spedire i pacchetti che dovrebbero essere destinati al router a me__ e quindi, potendoli, tendenzialmente, decifrare, puoi farci un po' tutto quello che vuoi. Cioè, detto in altre parole, crea la situazione chiamata man-in-the-middle (MITM).
Tendenzialmente perchè in realtà poi c'è di mezzo l'*https*, quindi... un passo alla volta.

Quindi, siamo arrivati al punto in cui, il mio coinquilino, o meglio il suo computer, spedisce i pacchetti internet a me invece che al router. 

Come fa Bettercap a dire al pc del mio coinquilino di spedire pacchetti a me? Praticamente succede questo, all'interno della rete, ogni dispositivo si crea una tabella, chiamata *tabella ARP*. 

Questa tabella serve per fare in modo che un pacchetto internet (contrassegnato con un IP specifico) venga spedito al reale destinatario. L'indirizzo IP difatto è una targa "temporanea", virtuale, che domani può cambiare, mentre ogni scheda di rete ha un indirizzo MAC che rimane sempre lo stesso (ora, anche qui non è propriamente vero che resta sempre uguale, si può cambiare, ma tendenzialemnte resta sempre lo stesso) e viene usato per identificare realmente a quale dispositivo bisogna mandare i pacchetti.

<div class="notice">
<h3>Come vedere la tabella ARP del tuo pc</h3>
Per vedere la tabella ARP del tuo computer UNIX (cioè Linux, Mac o altre cosette meno conosciute), basta dare il comando <i>arp -a</i>. Vedrete quindi la tabella di tutti i dispositivi che il tuo computer conosce e a cui ha associato l'indirizzo IP al rispettivo MAC Address. Se non vedete tutti i dispositivi della rete probabilmente è perchè il vostro dispositivo non ha mai interagito con quelli mancanti nella tabella. Un semplice <i>ping IP_MANCANTE</i> dovrebbe risolvere il problema.
</div>

Il problema di questa tabella, che permette a Bettercap di far funzionare il tutto, è che ogni dispositivo può mandare messaggi nella rete in *broadcast* che di fatto sono coppie <IP, MAC address> dove l'IP può essere qualsiasi cosa, non per forza quello a lui realmente assegnato e non vi è autenticazione per garantire che questo avvenga solo per chi ne ha realemnte diritto. E quindi il computer su cui è eseguito Bettercap (supponiamo abbia indirizzo MAC  00:00:00:ZZ:ZZ:ZZ e indirizzo IP 192.168.1.72) manda nella rete i seguenti pacchetti:

 - <192.168.1.1, 00:00:00:ZZ:ZZ:ZZ>
 - <192.168.1.2, 00:00:00:ZZ:ZZ:ZZ>
 - <192.168.1.3, 00:00:00:ZZ:ZZ:ZZ>
 - <192.168.1.4, 00:00:00:ZZ:ZZ:ZZ>
 ...

e così via per tutti gli indirizzi IP presenti nella rete. D'ora in avanti, quindi, tutti i computer che credono quei messaggi autentici manderanno al computer con Bettercap i pacchetti destinati al router (che sarà uno di quegli indirizzi IP, di solito 192.168.1.1 o 192.168.1.254) e Bettercap potrà analizzarli senza problemi in quanto transitano sulla scheda di rete a cui ha accesso.

'Na ficata no?!

### Difesa e raggiri
Come sempre, a ogni vulnerabilità si cerca un rimedio. Effettivamente esistono numerosi programmi online che bloccano gli indirizzi IP che cercano di inondare la rete con pacchetti ARP *melevoli*. Se ci pensate è abbastanza semplice, se un indirizzo MAC dichiara di essere tutti gli indirizzi IP della rete c'è qualcosa che non va... 

Nel caso il vostro router abbia una qualche protezione di questo genere, è possibile, con Bettercap, cercare di intercettare, con l'*ARP poisoning*, quella tecnica appena vista, solo il dispositivo *target*, in tal caso, l'attacco effettuato sarà *half-duplex*.

Se poi, ancora una volta questa cosa non dovesse funzionare perchè il dispositivo *target* a sua volta controlla i pacchetti ARP, è possibile cambiare metodologia e passare ad un attacco basato sul protocollo ICMP, di cui trovate maggior informazioni direttamente nella documentazione del tool.

## Bettercap
Arriviamo al dunque, come fare tutto questo con Bettercap?

```
sudo bettercap -s
```

Capite perchè da così tante soddisfazioni, semplicemente con `-s` lui fa tutte quelle cose lì.

Ci sono poi varie opzioni annesse, ad esempio

```
sudo bettercap -s arp --full-duplex
```

che manda quei pacchetti per dirottare il traffico sia al *target* che al router (contrariamente effettua un attacco *half-duplex* citato prima), potendo così vedere la botta e risposta completa, le pagine richieste e quelle ricevute dalla rete.

![https](https://www.dreamgroup.it/wp-content/uploads/2017/01/CKe4csi.png)

# E la cifratura?

Come potete immaginare, chiaramente, non è proprio così semplice poi nella realtà. Certo, abbiamo visto come reindirizzare il traffico della rete sul nostro PC e analizzarlo ma... se questi pacchetti che ci arrivano sono cifrati tra il *target* e il *server* (leggi, sito web a cui mi connetto), posso intercettarli quanto voglio ma non sarò in grado di leggerli. E questa è quasi la totalità dei casi, ogni qual volta il sito a cui il destinatario si connette è in *https*. 

E quindi, non ci arrendiamo mica...
Bettercap ci viene nuovamente in aiuto con varie tecniche, la più semplice è l'*ssl-strip*.

## SSL STRIP
Questa tecnica è stata introdotta da Moxie Marlinspike nel 2009 e consiste nel sostituire i link che dovrebbero essere sicuro con altri di cui abbiamo il controllo. Mi spiego meglio.

 - Tiziano (il nostro Target) apre un sito in http, i cui contenuti non sono quindi cifrati
 - Intercettata quindi questa pagina, si sostituiscono tutti i suoi link interni con altri link, banalmente togliendo la *s* di *https*.
 - Si inoltra il pacchetto pulito dai link che poterebbero a pagine cifrate e si continua come sempre

Questa cosa funziona, chiaramente, se la primissima pagina non è cifrata, altrimenti non siamo in grado di *"pulire"* il link.

Quindi ora fate un test, andate sulla pagina di Google connettendovi tramite http, cioè scrivete nel browser *http://google.it*.
Con altissima probabilità verrete reindirizzati alla pagina cifrata, tutta colpa di HSTS.

### HSTS
HTTP Strict Transport Security (HSTS) è un protocollo con cui il server può dire al browser che cerca di visitarlo che lui accetta solo connessioni cifrate, proprio per evitare attacchi come quelli appena descritti sopra. E allora?

E allora ecco la soluzione, introdotta da Leonardo Nve Egea al BlackHat Asia 2014. Poichè la politica HSTS si applica a specifici domini per lo più, basta sostituire il dominio e così, il link `https://wwww.facebook.com` viene modificato in `https://wwww.facebook.com`. Certo, qualcuno potrebbe accorgersene ma quanti di voi contano quante `w` ci sono quando aprite ogni link?

E ora? E ora quel `wwww.facebook.com` deve essere risolto da qualche DNS, ma chiaramente nessuno può risolverlo. Ma dov'è il problema, tanto tutto il traffico passa per il computer attaccante, può farsi lui di risolvere il dominio, aprire la connessione cifrata con il sito e rigirare il pacchetto decifrato al *target*.

## Ancora meglio?
Beh, Bettercap permette di fare anche di più, permette di installare un certificare di sicurezza e comunicare in HTTPS con il *target* così che il tutto diventa ancora più complesso da verificare, ma anche tutto più complesso da raccontarvi ora.

Vuoi provare? Avvia Bettercap con queste opzioni:
```
sudo bettercap -T IP_CELLULARE --proxy 
```
Ora prendi il tuo cellulare, vai nella Home di questo sito (che è senza *http*, perchè aihmè, se lo fanno pagare) e quindi clicca sull'icona di LinkedIn. Come vedrai sarai su qualcosa come *wwwww.linkedin.it/...* (a me ne mostra 5 di *w*), e sarete in grado di vedere il traffico generato senza che questo sia cifrato.

#### Cosa possiamo imparare?
Occhio a quando non siete in *https*!!

# Installazione
Si può facilemnte installare in vari modi, tra cui

```
gem install bettercap
``` 
o seguendo la [documentazione](https://www.bettercap.org/index.html#document-install).

Una volta installato non dovete far altro che avviarlo, da terminale, con il seguente comando

```
sudo bettercap -T 192.168.1.10 -X -I interfaccia
```

dove -T IP (opzionale) rappresenta l'IP di cui volete intercettare il traffico, *interfaccia* è il nome dell'interfaccia su cui attivate il tutto, ad esempio la mia interfaccia wifi è en1, puoi scoprire la tua con un `ifconfig`.

Per il resto la [documentazione](https://www.bettercap.org/index.html) ufficiale è molto chiara, quindi potete andare direttamente lì per leggere le mille opzioni previste e usarle.
