---
layout: post
title:  "Come aggiungere a WooCommerce articoli con variazione via codice (programmatically)"
date:   2017-06-27
excerpt: "Una guida su come velocizzare l'inserimento dei prodotti su WooCommerce, con l'aiuto del PHP e delle API Wordpress"
tag:
- Wordpress
- WooCommerce
- Hack
- Reverse Engineering
comments: true
feature: /assets/img/post-image/woocommerce.png
---
<img src="{{ site.url }}/assets/img/post-image/woocommerce.png" style="float:left; margin: 15px;"/>Woocommerce è il più famoso plugin di Wordpress per la realizzazione di siti eCommerce. I suoi punti di forza sono tantissimi tra i quali la personalizzazione estrame dei prodotti. Il problema che però spesso si incontra è come caricare in maniera efficiente le decine e decine di prodotti senza perderci le giornate intere?

Quello che cercherò di fare io ora, è arrivare ad una soluzione per aggiungere prodotti con variazioni, via codice, andando quindi a velocizzare la fare di inserimento.
<br/>

# Cosa sono i prodotti con variazione
I prodotti con variazione sono quelli oggetti che hanno varie opzioni personalizzabili dall'utente durante la fase di acquisto e il cui prezzo viene modificato in base a queste scelte. Un classico esempio è una tipografia online che vende un volantino che può essere:

 - A4, A5 o in A6
 - Con 1 colore, 2 colori o 4 colori
 - Su Carta lucida o carta opaca
 - Con grammatura 100, 150 o 200gr
 - Solo fronte o Fronte/Retro

WooCommerce ci permette di aggiungere per ogni possibile scelta dell'utente un prezzo, ad esempio posso specificare che

 - A4, 1 Colore, Lucida, 100gr, Fronte = 10€
 - A4, 2 colori, Opaca, 100gr, F/R = 12€
 - ... ecc ecc

Il problema, come quelli più bravi di voi in combinatoria avranno già visto, è che con anche quelle semplici opzioni definite prima, abbiamo da specificare 108 possibili scelte dell'utente con conseguente impiego di tempo per il caricamente del prodotto. L'idea è quindi quella di trovare un modo più efficiente per fare tutto

L'intuizione è quella di creare una funzione in un qualche linguaggio che, date le scelte ed un file CSV (cioè l'esportazione di un file Excel che ci passerà il cliente), ci generi del codice che aggiunge al DB i prodotti comprensivi di variazioni e prezzi. 

# Il database 
Qui inizia il bello, abbiamo vari modi, uno brutale (leggasi SQL puro), l'altro più raffinato che prevede l'impiego delle API di Wordpress. Andiamo a vedere questo secondo approccio perchè più sicuro e veloce.

Una rapida ricerca online ci porta a capire quali sono le API che ci interessano in questa fase:

 - `wp_insert_post()` - Insert or update a post. [doc](https://developer.wordpress.org/reference/functions/wp_insert_post/)
 - `update_post_meta()` - Update post meta field based on post ID. [doc](https://developer.wordpress.org/reference/functions/update_post_meta/)
 - `wp_set_object_terms()` - Create Term and Taxonomy Relationships. [doc](https://developer.wordpress.org/reference/functions/wp_set_object_terms/)
 - `update_post_meta()` - Update post meta field based on post ID. [doc](https://developer.wordpress.org/reference/functions/update_post_meta/)

Per prima cosa dobbiamo inserire il nostro post nella relativa tabella usando la funzione di Wordpress `wp_insert_post` e tenendoci poi in memoria il relativo `post_id`:

```php
$product_title = "Titolo del prodotto";
$product_description = "Descrizione del prodotto";
$post = array(
        'post_author'  => 1,
        'post_content' => $product_description,
        'post_status'  => 'publish',
        'post_title'   => $product_title,
        'post_parent'  => '',
        'post_type'    => 'product'
    );
$post_id = wp_insert_post($post); 
if(!$post_id){
	return false; // Si è verificato un errore
}
```

Andiamo quindi ad aggiungere altre proprietà del prodotto (generico, senza variazioni), con la funzione `update_post_meta` e con la funzione `wp_set_object_terms` che modifica le tabelle `wp_terms`, `wp_term_relationships` e `wp_term_taxonomy`:

```php
$product_categories = array("Volantini", "Piccolo Formato");
update_post_meta( $post_id,'_visibility','visible');
wp_set_object_terms( $post_id, $product_categories, 'product_cat');
```
Altre proprietà, i cui nomi sono abbastanza esplicativi, che possiamo andare ad impostare in questa maniera sono le seguenti:
 - _wc_review_count
 - _wc_rating_count
 - _wc_average_rating
 - _edit_last
 - _edit_lock
 -  _sku
 - _regular_price
 - _sale_price
 - _sale_price_dates_from
 - _sale_price_dates_to
 - total_sales
 - _tax_status
 - _tax_class
 - _manage_stock
 - _backorders
 - _sold_individually
 - _weight
 - _length
 - _width
 - _height
 - _upsell_ids
 - _crosssell_ids
 - _purchase_note
 - _default_attributes
 - _virtual
 - _downloadable
 - _product_image_gallery

A questo punto, nella tabella `wp_posts` abbiamo il nostro prodotto, a cui dobbiamo ancora aggiungere tutte le varie variazioni.

# Attributi
**Attenzione!** Prima di procedere devi creare gli attributi che andrai ad utilizzare (Dimensione, Colore, Taglia...).![addAttributesMenu]({{ site.url }}/assets/img/post-image/attr.png) Lo slug deve essere quello usato poi nel file JSON di riferimento, nel caso in fondo all'articolo quindi "Dimensione" e "Colore".
{: .notice}


Per inserire gli attributi dei vari prodotti è un po' complessa la cosa. O li inseriamo a mano nei vari prodotti e poi andiamo quindi a creare le variazioni nel database con gli attributi già creati, o dobbiamo andare a modificare il record con `meta_key = _product_attributes` dentro la tabelle `wp_postmeta` che somiglia a questo (che dopo un po' di ricerche ho scoperto essere una serializzazione PHP):

```
a:2:{
	s:10:"dimensione";
	a:6:{
		s:4:"name";
		s:10:"Dimensione";
		s:5:"value";
		s:16:"Grande | Piccolo";
		s:8:"position";
		i:0;
		s:10:"is_visible";
		i:1;
		s:12:"is_variation";
		i:0;
		s:11:"is_taxonomy";
		i:0;
		}
	s:6:"colore";
	a:6:{
		s:4:"name";
		s:6:"Colore";
		s:5:"value";
		s:19:"Rosso | Blu | Verde";
		s:8:"position";
		i:1;
		s:10:"is_visible";
		i:1;
		s:12:"is_variation";
		i:0;
		s:11:"is_taxonomy";
		i:0;
		}
	}
```

Usiamo quindi:

```
unserialize('a:2:{s:10:"dimensione";a:6:{s:4:"name";s:10:"Dimensione";s:5:"value";s:16:"Grande | Piccolo";s:8:"position";i:0;s:10:"is_visible";i:1;s:12:"is_variation";i:0;s:11:"is_taxonomy";i:0;}s:6:"colore";a:6:{s:4:"name";s:6:"Colore";s:5:"value";s:19:"Rosso | Blu | Verde";s:8:"position";i:1;s:10:"is_visible";i:1;s:12:"is_variation";i:0;s:11:"is_taxonomy";i:0;}}');
```

e vediamo che quello che dobbiamo salvare nel database viene da un array fatto nel seguente modo:

```
array(2) {
  ["dimensione"]=>
  array(6) {
    ["name"]=>
    string(10) "Dimensione"
    ["value"]=>
    string(16) "Grande | Piccolo"
    ["position"]=>
    int(0)
    ["is_visible"]=>
    int(1)
    ["is_variation"]=>
    int(0)
    ["is_taxonomy"]=>
    int(0)
  }
  ["colore"]=>
  array(6) {
    ["name"]=>
    string(6) "Colore"
    ["value"]=>
    string(19) "Rosso | Blu | Verde"
    ["position"]=>
    int(1)
    ["is_visible"]=>
    int(1)
    ["is_variation"]=>
    int(0)
    ["is_taxonomy"]=>
    int(0)
  }
}
```

Possiamo quindi creare un array simile con gli attributi che ci servono, usare la funzione `serialize()` e inserire il risultato nella tabella `wp_postmeta` con 

```
update_post_meta($post_id, "_product_attributes", serialize($attributes_array))
```

Un modo più carino è stato creato da [ryanknights](http://ryanknights.co.uk/insert-woocommerce-products-variations-programmatically/). Prendendo quindi le informazioni dal file JSON e unendo il tutto ecco la funzione `insert_product_attributes()`:

```php
<?php
function insert_product_attributes ($post_id, $available_attributes, $variations)  
{
    foreach ($available_attributes as $attribute) // Go through each attribute
    {   
        $values = array(); // Set up an array to store the current attributes values.

        foreach ($variations as $variation) // Loop each variation in the file
        {
            $attribute_keys = array_keys($variation['attributes']); // Get the keys for the current variations attributes

            foreach ($attribute_keys as $key) // Loop through each key
            {
                if ($key === $attribute) // If this attributes key is the top level attribute add the value to the $values array
                {
                    $values[] = $variation['attributes'][$key];
                }
            }
        }

        // Essentially we want to end up with something like this for each attribute:
        // $values would contain: array('small', 'medium', 'medium', 'large');

        $values = array_unique($values); // Filter out duplicate values

        // Store the values to the attribute on the new post, for example without variables:
        // wp_set_object_terms(23, array('small', 'medium', 'large'), 'pa_size');
        wp_set_object_terms($post_id, $values, 'pa_' . $attribute);
    }

    $product_attributes_data = array(); // Setup array to hold our product attributes data

    foreach ($available_attributes as $attribute) // Loop round each attribute
    {
        $product_attributes_data['pa_'.$attribute] = array( // Set this attributes array to a key to using the prefix 'pa'

            'name'         => 'pa_'.$attribute,
            'value'        => '',
            'is_visible'   => '1',
            'is_variation' => '1',
            'is_taxonomy'  => '1'

        );
    }

    update_post_meta($post_id, '_product_attributes', $product_attributes_data); // Attach the above array to the new posts meta data key '_product_attributes'
}
?>
```

# Aggiungiamo le variazioni
Arrivati a questo punto abbiamo quindi un `$post_id` corrispondente al prodotto in questione. E una array delle variazioni, magari qualcosa del genere:

```
[
    {
        "attributes": {
            "Dimensione"  : "Grande",
            "Colore" : "Rosso"
        },
        "price" : "8.00"
    },
    {
        "attributes": {
            "Dimensione"  : "Piccolo",
            "Colore" : "Verde"
        },
        "price" : "10.00"
    }
    [...]
]
```
A questo punto non ci resta che inserire le variazioni effettivamente. Le variazioni non sono altro che post con tipo `product_variation` e `post_parent` il prodotto inserito prima, per capirci `$post_id`.

```php
<?php
function insert_product_variations ($post_id, $variations)  
/* Developed by http://ryanknights.co.uk/insert-woocommerce-products-variations-programmatically/ */
{
    foreach ($variations as $index => $variation)
    {
        $variation_post = array( // Setup the post data for the variation
            'post_title'  => 'Variation #'.$index.' of '.count($variations).' for product#'. $post_id,
            'post_name'   => 'product-'.$post_id.'-variation-'.$index,
            'post_status' => 'publish',
            'post_parent' => $post_id,
            'post_type'   => 'product_variation',
            'guid'        => home_url() . '/?product_variation=product-' . $post_id . '-variation-' . $index
        );

        $variation_post_id = wp_insert_post($variation_post); // Insert the variation

        foreach ($variation['attributes'] as $attribute => $value) // Loop through the variations attributes
        {   
            $attribute_term = get_term_by('name', $value, 'pa_'.$attribute); // We need to insert the slug not the name into the variation post meta

            update_post_meta($variation_post_id, 'attribute_pa_'.$attribute, $attribute_term->slug);
          // Again without variables: update_post_meta(25, 'attribute_pa_size', 'small')
        }

        update_post_meta($variation_post_id, '_price', $variation['price']);
        update_post_meta($variation_post_id, '_regular_price', $variation['price']);
    }
}
?>
```

# Come far funzionare il tutto
Arrivati a questo punto non ci resta che mettere insieme tutti i pezzi. Il problema ora è che abbiamo usato delle funzioni di Wordpress che dovranno essere eseguite, chiaramente, all'interno del framework di Wordpress. La cosa più semplice da fare è quella di creare un plugin che, una volta installato, esegua tutte queste funzioni e ci aggiorni il database.

## Creare un plugin
Andiamo a creare un nuovo file PHP, `myplugin.php`, che, una volta attivato, eseguirà il nostro codice:

```php
<?php
   /*
   Plugin Name: WooCommerce Variable Product Test
   Plugin URI: http://wordpress.org
   Description: My Plugin
   Version: 1.0
   Author: Me
   Author URI: http://wordpress.org
   License: GPL2
   */

   function onActivation(){
     // Inseriamo qui tutto il nostro codice che deve essere eseguito
   }
   register_activation_hook(__FILE__, 'onActivation');
?>
```

That's all!
Nice coding!

Complete plugin ready to run: [download it]({{ site.url }}/assets/plugin.zip)

#### References
[ryanknights.co.uk](http://ryanknights.co.uk/insert-woocommerce-products-variations-programmatically/)