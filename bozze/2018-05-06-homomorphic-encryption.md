---
layout: post
title:  "Homomorphic Encryption"
date:   2018-03-07
excerpt: "A javascript Chord simulator to analyze network topology and performance."
project: true
tag:
- javascript
- p5.js
comments: true
feature: https://apagiaro.it/assets/img/post-image/chord.png
showFeature: true
---

In the last years, the cloud business model has become more and more popular. But creating a private cloud is expensive so, often, a hybrid or public cloud is used.  
Today, as Google and Facebook can show, the data are the power (and money) and so, store the data on some provider can be a bad idea if that data are my business. So, how to use the public cloud with encrypted keys?

This is what the Homomorphic encryption does: compute some algorithms on encrypted data and, once you decrypt it, you find the same result that you find if you compute the "same" algorithm on the decrypted data.

The Homomorphic encryption is, in a more formal way, a system where:

$$ Encr(A+B) = Plus(Encr(A), Encr(B) $$

$$ Encr(A \times B) = MUL(Encr(A), Encr(B) $$

$$ Encr(A...B) = ALGORITHM(Encr(A), Encr(B) $$

The system is called _fully homomorphic_ if there are no limitations on the operations that can be performed.

