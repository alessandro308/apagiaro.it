---
layout: post
title:  "La crittografia moderna spiegata a mia mamma"
date:   2017-08-21
excerpt: "Introduzione per non tecnici alla crittografia moderna - Scambiarsi una chiave"
tag:
- crittografia
- RSA
comments: true
feature: http://www.androidworld.it/wp-content/uploads/2015/03/crittografia-1280x720.jpg
---

Da sempre l'uomo cerca modi per nascondere i propri messaggi. Erodoto narra che nell'antica Persia i messaggi venivano scritti sulla testa degli schiavi, si attendeva che i capelli crescessero e venivano mandati come messaggeri. 
Ad oggi, con l'introduzione dei computer siamo in grado chiaramente di usare metodi più veloci e sofisticati che spesso risultano come un'enorme magia agli occhi dei meno tecnici. Lo scopo di questa pagina è quindi quella di fornire l'idea di base delle nuove tecniche senza entrare nel dettaglio, un po' come un mago che rivela i suoi trucchi, fornendo in caso riferimenti più specifici e tecnici per approfondire. Troverete in fondo alla pagina un piccolo glossario con i termini che noi informatici amiamo usare ma che spesso non sono chiari a chi non è dell'ambiente.

Iniziamo subito nel dire che esistono due tipi di <a href="#glossario">algoritmi</a> crittografici, quelli simmetrici e quelli asimmetrici.
Quelli simmetrici sono quelli che solitamente ti immagini quando pensi ad un modo per cifrare e decifrare qualcosa. All'asilo scrivevi le parole al contrario, quello era una algoritmo simmetrico perchè per decifrare il tutto dovevi... beh, dovevi semplicemente leggere le parole al contrario. L'idea, nel caso simmetrico, è quello che la <a href="#glossario">chiave</a> di cifratura è la stessa di decifratura.

Un esempio di cifrario simmetrico piuttosto semplice è quello di Cesare dove ogni lettera viene sostituita da un'altra applicando uno <i>shift</i> all'alfabeto. Questa immagine vi chiarirà tutto:
![cifrario di cesare](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Caesar3.svg/300px-Caesar3.svg.png)
In questo caso, la chiave sarà la quantità di lettere traslate, nell'immagine <i>chiave=2</i>.

# Il problema dello scambio della chiave
Ecco, qui si introduce il principale problema della crittografia moderna, come scambiarsi una chiave? Di certo non posso cifrarla perchè cifrando una chiave avrei bisogno della chiave per cifrare la chiave, che a sua volta richiederebbe... Avete capito no? 
Il modo più semplice è quello di vedersi di persona e scambiarsi la chiave, anche perchè qualsiasi altro modo potrebbe essere intercettato (una chiamate al telefono, una mail, un messaggio...). 

A questo problema qualcuno è riuscito a trovare una soluzione. La maggior parte degli algoritmi utilizza metodi matematici quindi da ora in poi la nostra chiave sarà un numero, potete facilmente immaginare come creare un numero da una parola, ad esempio dicendo che A=1, B=2, C=3... e facendo quindi diventare la parola ABCABC = 123123.

Ecco, qui vorrei spiegarvi l'algoritmo ma utilizza un po' di strumenti matematici che al liceo non insegnano, cercherò di essere più chiaro possibile. 

##### Allerta, qui si parla di matematica!!
Introduciamo un <a href="#glossario">operatore matematico</a> chiamato <i>modulo</i> (mod) che restituisce come risultato il resto della divisione intera tra il primo e il secondo termine dell'operazione.

Facciamo un paio di esempi:

\\[ 10 \ mod \ 3 = 1 \\]

Questo perchè 10 diviso 3 fa 3 con il resto di 1. Se è chiaro il concetto, sapete dirmi quanto fa \\( 15 \ mod\ 4  \\)?
Il risultato è 3. È interessante notare che il risultato dell'operatore modulo tra due numeri <i>x</i> e <i>y</i> è al più <i>y-1</i>, altrimenti potevo dividere ancora per <i>y</i> e il resto inferiore. Ma forse vi sto solo confondendo con questa ultima frase... Quindi, torniamo a noi. 

Un'altro operatore che andiamo ad usare è l'elevamento a potenza, molto più familiare a tutti noi che ci dice quante volte un numero deve essere moltiplicato per se stesso:
\\[ 4^4 = 16\\]

## Scambio di chiavi Diffie-Hellman (1976) [Wikipedia](https://it.wikipedia.org/wiki/Scambio_di_chiavi_Diffie-Hellman)

Facciamo un esempio di questo <a href="#glossario">protocollo</a> (si, lo so, prima l'ho chiamato algoritmo ed ora protocollo, cambia la definizione ma potete pensarlo comunque come una serie di passi per trovare una soluzione al nostro problema di scambio delle chiavi, non ci formalizziamo sulle definizioni).
Chiamiamo i due tipi che vogliono trovare una chiave condivisa comune Alice e Bob (a volte semplicemente abbreviati con A e B).

 - A e B si accordano su due numeri, \\( p, g \\), dove p è un numero primo e g è un <a href="#glossario">generatore</a>. Nel nostro esempio <i> p = 23, g=5</i>. Questi numeri vengono scambiati tra Alice e Bob in maniera del tutto normale, senza dover nascondere nulla.
 - A questo punto, Alice sceglie un suo numero <b>segreto</b> a e Bob fa lo stesso, scegliendo un numero b.
 Nel nostro esempio: <i>a=6, b=15</i>.
 - Alice manda a Bob \\(g^a\ mod\ p \\), nel nostro esempio \\( 5^6\ mod\ 23 = 8 \\).
 - Bob fa lo stesso, mandando ad Alice \\(g^b\ mod\ p \\), cioè \\(5^{15}\ mod\ 23 = 19 \\).
 - A questo punto, sia Bob che Alice sono in grado di calcolare la chiave finale prendendo il numero che gli è arrivato ed elevandolo con il loro numero segreto.\\
 Alice farà quindi \\( (g^b\ mod\ p)^a\ mod\ p \\) mentre Bob farà \\( (g^a\ mod\ p)^b\ mod\ p \\).

Al termine di queste operazioni, sia Alice che Bob sono in possesso di \\(g^{ab}=g^{ba} \\). E potranno usare questo come chiave condivisa.

##### Allerta, qui si parla di matematica!!
Qui arriva la parte complicata, convincervi che questa cosa funziona senza entrare in dettagli matematici complessi. Chiaramente tutta questa cosa funziona perchè usiamo quel famoso operatore <i>modulo</i>, senza infatti quello, tutto questo protocollo crollerebbe perchè potrei facilmente capire qual era il numero segreto di Alice semplicemente facendo \\( \log_g{g^a} \\). (Ok, ok, forse il logaritmo non è proprio la cosa più familiare a tutti ma fidatevi, è una cosa davvero semplicissima da fare).

Quando invece ci troviamo con un operatore come quello del modulo, non stiamo più "giocando" con tutti i numeri come siamo abituati a fare ma entriamo in un campo un po' strano dove invertire le operazioni non è più tanto semplice. Volete un esempio?

Proviamo a fare, senza usare il modulo \\( 13 * 5 \\). Quanto fa? Banale, fa 65. Ora, se io volessi trovare quel numero che, preso 65, lo moltiplico e mi torna due è semplice, è \\( \frac{1}{5} \\), difatti \\( 65*\frac{1}{5} = 15\\). Possiamo quindi dire che l'inverso di 5 è \\( \frac{1}{5}\\). 

Bene, proviamo ora a rifare tutto questo discorso con l'operatore modulo di mezzo. Prendiamo come valore del modulo 23 (numero scelto a caso).
\\[ 13 * 5 \ mod\ 23 = 19\\]
A questo punto dobbiamo provare ad invertire l'operazione, cioè trovare un numero tale che 
\\[ 19 * 14 \ mod\ 23 = 13 \\]
Quel valore che cerchiamo è 14. Quindi, l'inverso di \\( 14 \ mod\ 23 = 19 \\). Come potete vedere non è banalissimo trovare gli inversi e quindi invertire operazioni così semplici come anche una semplice moltiplicazione... pensate poi se lavoriamo con numeri moooolto mooooooolto grandi.

Se sono riuscito quindi a convincervi che questo operatore modulo complica abbastanza le cose da rendere complesse alcune operazioni, possiamo proseguire...

## Cosa fare con la chiave condivisa
A questo punto, abbiamo Alice e Bob che si trovano quindi con una stessa chiave che possono usare per cifrare qualsiasi messaggio con i metodi più classici che potete immaginarvi. Beh, c'è da dire che quelli usati oggi tanto classici non sono e hanno dei nomi un po' strani, tipo AES-256 (Advanced Encryption Standard con 256 bit come lunghezza della chiave) ma si trattano, più o meno, di metodi che mischiano le lettere del vostro messaggio (più correttamente mischiano i bit che compongono le varie lettere in un formato digitale) e ne restituiscono una serie incomprensibile se non si conosce la chiave usata che permette di rimettere a posto il tutto.

# La crittografia asimmetrica
Ci sono degli algoritmi e dei protocolli che non richiedono di avere una chiave scambiata in precedenza per garantire ad un mittente di spedire un messaggio cifrato ed ad un ricevente di decifrarlo correttamente. Lo so, è strana come cosa, a me sembrava magia oscura quando me l'hanno raccontata la prima volta, in realtà non è così complicata la cosa anche se, quando è stato trovato il famoso algoritmo asimmetrico RSA nel 1977 da Ronald Rivest, Adi Shamir e Leonard Adleman, la cosa non era poi così tanto scontata.

Nel prossimo post ve ne parlerò in maniera più dettagliata.

<div id="glossario">

<h2>Glossario</h2>
<ul>
 <li>
 	<b>Algoritmo</b>: è una serie di istruzioni svolte per risolvere un problema. Un algoritmo che tutti conoscono è quello per effettuare moltiplicazioni in colonna di numeri a più cifre, quel modo di moltiplicare le singole cifre, addizionare i vari risultati intermedi e trovare il risultato finale è un chiaro esempio di cosa è un algoritmo. Una serie di passi che porta ad un risultato.
 </li>
 <li>
 	<b>Chiave</b>: è una parola (solitamente si parla di sequanza di bit) che viene usata per cifrare e decifrare qualcosa. A volte viene erroneamente chiamata <i>password</i>
 </li>
 <li>
 	<b>Operatore</b>: l'operatore dell'addizione è il +, l'operatore della sottrazione è il -... Insomma, l'operatore è quell'oggetto che ci indica l'operazione da fare
 </li>
 <li>
 	<b>Protocollo</b>: In informatica un protocollo di comunicazione è un insieme di regole formalmente descritte, definite al fine di favorire la comunicazione tra una o più entità. (Wikipedia)
 </li>
 <li>
 	<b>Generatore</b>: qui la cosa si fa difficile da spiegare in poche righe, vi rimando alla [pagina Wikipedia](https://it.wikipedia.org/wiki/Generatore_(teoria_dei_numeri)).
 </li>
</ul>

 </div>