---
layout: post
title:  "Come salvare le password nel database in maniera sicura"
date:   2017-11-23
excerpt: "E come non salvarle..."
tag:
- security
- database
feature: http://www.informationsecuritybuzz.com/wp-content/uploads/13186099_s.jpg
comments: true
---
Si sa, l'utente medio usa una password unica per tutti i vari siti a cui si iscrive. Ma quanti di questi si chiedono come sono salvate le loro password all'interno di questi siti? Lo scopo di questo articolo è quindi di fare una breve panoramica sulle tecniche utilizzate per salvare gli utenti e la password associata nei database sui vari siti e analizzarne le criticità.

## Background
Prima di iniziare ad approfondire l'argomento ci occorre conoscere il concetto di funzione hash. Questa particolare funzione la useremo infatti in alcuni dei metodi per incrementare la sicurezza del salvataggio della password.

Una funzione hash è una funzione che prende in input una qualsiasi sequenza di bit {0,1}, e ne restituisce una sequenza di lunghezza limitata.

Richiediamo, per un nostro utilizzo informatico per questo scopo, che la funzione hash sia crittograficamente sicura, cioè che

 - **Sia resistente alla preimmagine**: sia computazionalmente intrattabile (cioè ci si impiega troppo tempo) la ricerca di una stringa in input che dia un hash uguale a un dato hash
 - **Sia resistente alla seconda preimmagine**: sia computazionalmente intrattabile la ricerca di una stringa in input che dia un hash uguale a quello di una data stringa
 - **Sia resistente alle collisioni**:  sia computazionalmente intrattabile la ricerca di una coppia di stringhe in input che diano lo stesso hash

Una delle più famose funzioni hash è la SHA-256, che, preso in input una sequenza di bit, restituisce in output una sequenza di 256 bit.

#### Esempio
SHA-256("Buongiorno a tutti!") = a676a97982d936d0e5c0754e7f6498545e866af8a7ba5e1423e9d508a0936249\\
SHA-256("Buongiorno a tutte!") = 93506259360027cc82a29c1b7a2e5aca46df86047d2bbedc297c4754c57560e1

Bene, siamo pronti per iniziare!

# Metodo 1
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#aaa; width: 300px;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#333;background-color:#fff;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#fff;background-color:#f38630;}
.tg .tg-j2zy{background-color:#FCFBE3;vertical-align:top}
.tg .tg-016x{color:#ffffff;vertical-align:top}
.tg .tg-yw4l{vertical-align:top}
</style>
<center>
<table class="tg">
  <tr>
    <th class="tg-016x">ID</th>
    <th class="tg-016x">user</th>
    <th class="tg-016x">password</th>
  </tr>
  <tr>
    <td class="tg-j2zy">001</td>
    <td class="tg-j2zy">pippo</td>
    <td class="tg-j2zy">pluto</td>
  </tr>
  <tr>
    <td class="tg-yw4l">002</td>
    <td class="tg-yw4l">topolino</td>
    <td class="tg-yw4l">quiquoqua</td>
  </tr>
  <tr>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
  </tr>
</table>
</center>
Il primo metodo che ci può venire in mente è semplice, prendo lo username e la password dell'utente e lo inserisco nel database. Beh, un'idea più stupida vi viene in mente? Il problema nasce dal fatto che in questo modo ho inviato in chiaro la password dal client (il computer che l'utente usa per registrarsi) al server (okok, potrei usare https ma non sempre questo succede) e ho salvato tutto in chiaro nel database... e se il database viene violato? Password gratis e facili per tutti! E visto che l'utente avrà spesso la stessa password per più servizi, buona fortuna!

# Metodo 2
<center>
<table class="tg">
  <tr>
    <th class="tg-016x">ID</th>
    <th class="tg-016x">user</th>
    <th class="tg-016x">password</th>
  </tr>
  <tr>
    <td class="tg-j2zy">001</td>
    <td class="tg-j2zy">pippo</td>
    <td class="tg-j2zy">bf52f397be39d08126685c32b75f44405c8b9b0876c719dea456a40780b10e0c</td>
  </tr>
  <tr>
    <td class="tg-yw4l">002</td>
    <td class="tg-yw4l">topolino</td>
    <td class="tg-yw4l">73dc28b2cd5edc4bc25e095c0770c11f467ac0eb33ac26566c941cdb8b087592</td>
  </tr>
  <tr>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
  </tr>
</table>
</center>
Il secondo metodo prevede l'utilizzo della funzione hash. 
L'utente al momento della registrazione invia la password, lato client (così anche in caso di Man-in-the-middle la password rimane al sicuro) viene calcolato l'hash, viene inviato l'hash al server che lo salva nel database.

Poichè la funzione hash è resistente alla preimmagine, e per sua natura non è invertibile, conoscendo il solo risultato hash, non sono in grado di risalire alla password e quindi il mio database, in caso di violazione, tiene al sicuro le password in chiaro dei miei utenti. Sbagliato! 

È vero che la funzione hash è resistente alla preimmagine, è resistente alla seconda preimmagine, ma, se due utenti usano la stessa password, [cosa non così fuori dal mondo](http://www.corriere.it/tecnologia/cyber-cultura/15_gennaio_21/password-cambiare-suggerimenti-008ea4d0-a15b-11e4-8f86-063e3fa7313b.shtml), il loro hash risulterà uguale e quindi, violando il database e conoscendo la password di un utente, posso anche conoscere tutti gli altri utenti che usano la medesima password.

# Metodo 3
Ed ecco quindi arrivati al metodo che di fatto dovrebbe essere usato oggi. La password salvata tramite hash con il salt.
<center>
	<table class="tg">
  <tr>
    <th class="tg-016x">ID</th>
    <th class="tg-016x">user</th>
    <th class="tg-016x">password</th>
    <th class="tg-yw4l">Salt</th>
  </tr>
  <tr>
    <td class="tg-j2zy">001</td>
    <td class="tg-j2zy">pippo</td>
    <td class="tg-j2zy">cfb6cdfda55efb2a6d5d5d8870d2477241f97c6804a53a627645b1a66e9c2562</td>
    <td class="tg-j2zy">21323</td>
  </tr>
  <tr>
    <td class="tg-yw4l">002</td>
    <td class="tg-yw4l">topolino</td>
    <td class="tg-yw4l">b4017d36d62a259f4619d3a2588cc1d431de53b9b0d899ebfdde9886806598c1</td>
    <td class="tg-yw4l">65542</td>
  </tr>
  <tr>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy">...</td>
    <td class="tg-j2zy"></td>
  </tr>
</table>
</center>

L'utente, al momento della registrazione inserisce la password. A tale password viene concatenato un numero generato casualmente (chiamato _salt_, dall'inglese chicco di sale) e viene fatto l'hash della password+_salt_. A questo punto viene inviata al server la coppia &lt;hash(password+salt), salt&gt; e salvata tale coppia nel database. L'utente, al momento del login, invia la password, il server la concatenerà con il _salt_, ne calcolerà l'hash e se il risultato coincide con quanto salvato nel database darà l'ok per l'autenticazione. Complicando un po' il protocollo di login si può anche fare che il _salt_ viene rimandato al client che spedirà solamente l'hash finale al server, sempre per evitare intercettazioni di traffico che comunque, con l'avvento dell'https sono diventate più complesse da effettuare.

Nel caso di una violazione del database le password risulteranno al sicuro perchè, pur conoscendo la password di un utente, non siamo in grado di determinare se altri utente hanno la stessa password (se non andando a ricalcolare tutti gli hash).

## Precisazioni finali
Tanto per chiarezza, nessun dato possiamo ritenerlo al sicuro se è online, ma possiamo rendere la vita difficile a chi tenta di rubarlo. Conoscere l'hash non ci porta a nessun risultato utile poichè trovare una stringa che generi quell'hash vuol dire provare tutte le possibili stringhe, cioè taaaantissimi tentativi, e usare l'hash come password non porterà a nessun risultato in quanto il server si aspetta una password e quindi tratterà l'hash come tale, producendo di fatto, per il confronto nel database, l'hash dell'hash, che è un nuovo hash totalmente differente dal precedente.
