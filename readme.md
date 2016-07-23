<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*- -->

<!-- region header
Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

<!--|deDE:Einsatz-->
Use case
--------

A jQuery plugin to serve a store locator with google maps API.
<!--deDE:
    Ein jQuery-Plugin zum Bereitstellen eines Google-Maps-Storelocator.
-->

<!--|deDE:Inhalt-->
Content
------

<!--Place for automatic generated table of contents.-->
[TOC]

<!--|deDE:Beispiele-->
Examples
--------

<!--|deDE:Verwendung-->
Usage
-----

<!--|deDE:Designvorgaben für die Store-Locator Beispiele-->
### Adding some style to our store locator examples

<!--showExample:css-->

    #!CSS

    body div.simple-store-locator, body div.advanced-store-locator {
        width: 100%;
        height: 400px;
        margin: 0px;
        padding: 0px
    }
    body div.simple-store-locator > div,
    body div.advanced-store-locator > div {
        height: 100%;
    }
    body div.simple-store-locator input.form-control,
    body div.advanced-store-locator input.form-control {
        margin-top: 27px;
        width: 230px;
        display: none;
    }
    body div.simple-store-locator div.gm-style-iw > div,
    body div.advanced-store-locator div.gm-style-iw > div {
        width: 225px;
        height: 60px;
        padding: 5px;
    }

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
