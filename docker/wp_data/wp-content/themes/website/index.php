<?php

$context = Timber::get_context();
$context['posts'] = new Timber\PostQuery();
$context['template_directory'] = get_bloginfo('template_directory');

Timber::render('index.twig', $context);
