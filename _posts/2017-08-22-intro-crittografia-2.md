---
layout: post
title:  "La crittografia moderna spiegata a mia mamma, parte 2"
date:   2017-08-22
excerpt: "La crittografia asimmetrica"
tag:
- crittografia
- RSA
comments: true
feature: http://www.androidworld.it/wp-content/uploads/2015/03/crittografia-1280x720.jpg
---
Come avevamo già visto nella [prima parte]({{ site.url}}/intro-crittografia), uno dei problemi principale di quando dobbiamo cifrare qualcosa è il comunicare la chiave di decifrazione al destinatario in quanto non possiamo cifrarla in alcun modo. A risolvere questo problema ci pensano gli algoritmi di crittografia asimmetrica. 

Avete presente quel discorso fatto nella [prima parte]({{ site.url}}/intro-crittografia) in cui si diceva che trovare un inverso di un numero <i>n</i> quando c'è di mezzo l'operatore *modulo* non è poi così tanto banale? Ecco, è proprio ancora questa cosa che venne in aiuto a Ronald Rivest, Adi Shamir e Leonard Adleman nel 1977. 

## Come avremmo fatto 100 anni fa..
![lucchetti](http://www.intecosas.com/immagini/catalogo/materiali_consumo/lucchetti_CISA/lucchetto_ottone.jpg)
In uno scenario classico, se volessimo scambiarci messaggi tramite posta assicurandoci che nessuno di noi legga il messaggio potremmo fare una cosa del genere :
 - Ti mando una scatolina con dentro il messaggio e chiudo la scatolina con un lucchetto

Non possiamo chiaramente spedirci la chiave dei lucchetti, questa potrebbe essere intercettata...
 - Te ricevi la scatolina, ci aggiungi un tuo lucchetto conservando la chiave e mi rimandi la scatolina
 - La ricevo, rimuovo il mio lucchetto e ti rispedisco la scatolina, chiusa questa volta con il tuo lucchetto
 - La ricevi, la apri e leggi il messaggio

Per anni si è inseguita quest'idea ma quando si tratta di operazioni matematiche per cifrare e decifrare messaggi non sempre queste sono interscambiabili, in altre parole, se provassi a fare una cosa del tipo:
 - Prendo un messaggio *m* e lo cifro, ottenendo \\( C_a(m) \\)
 - Te ricevi il crittogramma (cioè il messaggio cifrato) e lo cifri a tua volta, ottenendo \\( C_b(C_a(m)) \\) e me lo rispedisci
 - Io lo ricevo, applico la funzione di decifrazione *D* ottenendo \\( D_a(C_b(C_a(m))) \\) e ti rimando il tutto
 - Te lo decifri e... 

e niente, ti ritrovi con una serie di lettere (*bit*) senza senso, a caso di cui non riesci più a capire quale fosse l'ordine iniziale, perchè, appunto, non possiamo applicare queste funzioni di decifrazione in un ordine diverso da quelle inverso rispetto alla cifratura.

## Cifrare e decifrare, due mondi in parallelo...
Chiarito quindi che questa strada non funziona bisogna cercare dei metodi per cifrare e decifrare che utilizzini dei *trucchetti* perchè tutto funzioni. Questi *trucchetti* consistono nel trovare un modo per generare due chiavi, una di cifratura ed una di decifratura tali che
 - Generare queste due chiavi insieme è semplice
 - Generare una di queste due chiavi, data l'altra non è facile (che in informatica vuol dire che ci vuole troppo tempo, troppe risorse di calcolo...)

Sembrano condizioni complicate ma pensate a quest'esempio, vi chiedo di darmi due numeri *A, B* tali che \\( A = B^2 \\). Ora, noi non avete difficoltà a darmi questa coppia di numeri, se ad esempio sceglieste \\( B = 1,4512\\), calcolare *A* sarebbe molto semplice, basta fare \\( B*B = A = 2,10598144\\). Se vi dessi, invece, solamente A, chiedendovi di calcolare *B*, risulterebbe tutto più complicato da fare senza calcolatrice (con la calcolatrice basterebbe fare *radice quadrata di B*). Questo esempio giocattolo cosa vuol insegnare, che esistono modi che sono facili da trovare se si conoscono dei trucchetti (nel nostro caso conoscendo *B* tutto è facile), ma complicati se non si conosce l'informazione completa o si è vincolati a scegliere qualcosa in relazioe ad altro già dato.

Se è chiara quest'idea possiamo provare a vedere come funziona uno dei più famosi algoritmi asimmetrici, l'RSA.

# L'algoritmo di crittografia asimmetrica RSA

Lo scopo di questo algoritmo è, innanzitutto, generare due coppie di numeri
\\[ K_{pu} = <e, n> \\]
\\[ K_{pr} = <d, n> \\]
dove, con \\( K_{pu} \\) identifichiamo la *public key*, la chiave pubblica, mentre con \\( K_{pr} \\) la *private key*. Cosa cambia tra queste due chiavi? Beh, una è pubblica ed una è privata. In altre parole, posso pubblicare liberamente in giro nel mondo la mia *chiave pubblica* e tutti possono cifrare usando quella, ma solamente io che conosco la *chiave privata* sono in grado di decifrare il messaggio. E per questa cosa delle due chiavi differenti prende l'aggettivo *asimmetrico*. Inoltre, conoscendo la mia *chiave pubblica* non è affatto banale trovare la mia *chiave privata*. È invece molto semplice generare le due chiavi insieme.

## Una cosa difficile come scomporre in fattori primi...
Com'è possibile? Una delle cose che andremo a sfruttare è il fatto che conoscere i numeri primi che scompongono un numero qualsiasi *n* non è semplice. Se ad esempio vi chiedessi quali sono i fattori primi di 15 tutti voi mi direste senza problemi la risposta: 3 e 5. Beh, quali sono i fattori di 145? Qualcuno con un minimo di abilità nel calcolo mentale può arrivarci: 5 e 29. Bene, e se vi chiedessi i fattori di 42342316719343? Vi do un suggerimento, questo numero è composto da solamente due numeri primi. La risposta? I primi che lo scompongono sono: 1232453 e 34356131. Come ho fatto a calcolare la scomposizione? Semplice, non l'ho fatto! Ho scelto prima i due numeri primi e poi ho trovato 42342316719343. 

Ancora una volta, un problema può essere molto semplice se visto da una diversa angolazione. E proprio questa difficoltà nel trovare i fattori primi di un numero sarà un punto su cui si baserà l'RSA. Difatti sarà molto facile generare le \\( K_{pu}, K_{pr}\\) conoscendo la scomposizione di *n* (che è quello stesso *n* che compare in \\( K_{pu}, K_{pr}\\)) ma sarà difficile farlo se non si conoscono questi fattori primi che sono complicati da trovare. Se magari ve lo stesse chiedendo, anche con i computer che fanno i calcoli veloci è complicato perchè il numero di operazioni che bisogna fare cresce tantissimo al crescere di *n*, cioè se scegliamo *n=35* dobbiamo fare un numero di operazioni accettabili, ma già con quel numero 42342316719343 non è poi così scontato, se poi pensate al fatto che i numeri che vengono scelti nella realtà sono grandi circa \\( 2^2048\\), cioè numero composti da più di 600 cifre, ecco che la difficoltà appare evidente.

## L'algoritmo
Detto questo, possiamo quindi vedere l'algoritmo generale, senza scegliere nel dettaglio (possiamo vedere nei commenti approfondimenti o chiarire qualcosa).

Nel nostro esempio, come la volta scorsa, sarà Alice che vuole mandare un messaggio a Bob.
 - Bob sceglie due numeri primi *p, q* molto grandi
 - Bob calcola \\( n = p*q \\) e calcola \\( \Phi(n) = (p-1)(q-1) \\), dove \\(\Phi\\) è anche detta [funzione di Eulero](https://it.wikipedia.org/wiki/Funzione_φ_di_Eulero).
 - Bob sceglie ora un numero *e* tale che \\( e < \Phi(n) \\), intero che sia coprimo con \\(\Phi(n)\\), cioè \\( MCD(e, \Phi(n)) = 1\\).
 - Bob calcola ora 
 	\\[ d = e^{-1} \ mod\ \Phi(n) \\]
 che è un'operazione molto complicata se non si conosce \\(\Phi(n)\\), ma per conosce  \\(\Phi(n)\\) occorre conoscere la scomposizioni in fattori primi di *n* e quindi ecco qui che ci siamo ricondotti all'esempio visto prima.
 - Bob pubblica dove preferisce la sua chiave pubblica
 	\\[ K_{pu} = <e, n>\\]
 - Bob si conserva la sua chiave privata *d*.

A questo punto Alice non deve far altro che prendere la chiave pubblica di Bob e usarla per cifrare il suo messaggio. In che modo?

 - Alice prende \\( K_{pu} = <e, n>\\) e il messaggio m
 - Spedisce a Bob il crittogramma *C*
 	\\[ C = m^e \ mod\ n\\]
 - Bob lo riceve, lo eleva alla sua chiave pubblica e lo decifra
    \\[ m = C^d \ mod\ n\\]
essendo *d*, l'inverso di *e*.

Non voglio ora annoiarvi con la dimostrazione del perchè questa cosa funziona, ci sono vari teoremi dietro che sfruttano le proprietà dei numero in un campo modulare. Trovate una buona spiegazione su [Wikipedia](https://it.wikipedia.org/wiki/RSA).

Nel prossimo post vediamo come sfrutturare questa cosa per firmare dei documenti e avere la certezza che il firmatario sia effettivamente chi dice di essere (cioè validare la firma).

[Terza parte >>>]({{ site.url }}/intro-crittografia-3)

