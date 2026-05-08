/**
 * ============================================================
 * PORTFOLIO — Script principal (vanilla JS)
 *
 * "Vanilla JS" = JavaScript pur, sans framework ni librairie
 * (pas de React, Vue, jQuery...). C'est la forme la plus basique.
 *
 * Structure :
 *   1. Navigation — scroll + mise en évidence du lien actif
 *   2. Animations — Intersection Observer pour les reveals
 *   3. Init       — déclencher les reveals déjà visibles au chargement
 * ============================================================
 */


// ============================================================
// 1. NAVIGATION
// ============================================================

/*
  SÉLECTIONNER DES ÉLÉMENTS DU DOM :
  
  Le DOM (Document Object Model) est la représentation en mémoire de votre HTML.
  Le navigateur lit le fichier HTML et crée un "arbre" d'objets JavaScript.
  On peut cibler et modifier ces objets avec JavaScript.
  
  Deux méthodes principales :
  
  ① document.getElementById('id')
     → Retourne UN SEUL élément (les id sont uniques).
     → Retourne null si l'élément n'existe pas.
  
  ② document.querySelectorAll('sélecteur CSS')
     → Retourne une NodeList (comme un tableau) de TOUS les éléments correspondants.
     → Utilise la même syntaxe que le CSS.
     → Si aucun élément trouvé, retourne une NodeList vide.
  
  "const" = déclare une variable constante.
  Elle ne peut pas être réassignée (navbar = autrePage; → erreur).
  Utiliser const par défaut, let si on doit réassigner.
*/
const navbar = document.getElementById('navbar');
// → récupère : <nav id="navbar">

const navLinks = document.querySelectorAll('.nav-links a');
// → récupère : tous les <a> à l'intérieur d'un élément avec class="nav-links"
// Résultat : NodeList [<a href="#about">, <a href="#skills">, <a href="#contact">]

const sections = document.querySelectorAll('section[id]');
// → sélecteur CSS avancé : tous les <section> qui ONT un attribut "id"
// Résultat : NodeList [<section id="hero">, <section id="about">, ...]


// -----------------------------------------------------------
// Fonction 1 : Fond de navigation au scroll
// -----------------------------------------------------------

/*
  Une fonction = un bloc de code réutilisable qu'on peut appeler plusieurs fois.
  Syntaxe : function nomDeLaFonction(paramètres) { ... }
  
  Celle-ci ne prend aucun paramètre.
  Elle est appelée à chaque événement "scroll" (voir plus bas).
*/
function handleNavBackground() {

    /*
      classList : propriété de tout élément DOM.
      Permet de manipuler les classes CSS de l'élément.
      
      classList.toggle('scrolled', condition) :
        - Si condition est VRAIE  → ajoute la classe "scrolled"
        - Si condition est FAUSSE → retire la classe "scrolled"
      
      window.scrollY : nombre de pixels scrollés depuis le haut de la page.
        - En haut de la page : scrollY = 0
        - Après avoir scrollé de 200px : scrollY = 200
      
      window.scrollY > 60 :
        - Retourne true si on a scrollé de plus de 60px
        - Retourne false si on est dans les 60 premiers pixels
      
      Effet : quand on scroll > 60px, .scrolled est ajouté à la nav.
              Le CSS de nav.scrolled active le fond semi-transparent et le flou.
    */
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}


// -----------------------------------------------------------
// Fonction 2 : Mise en évidence du lien actif dans la nav
// -----------------------------------------------------------

function updateActiveLink() {

    /*
      Variable "current" = l'id de la section actuellement visible.
      On commence avec une chaîne vide ''.
      "let" (et non const) car on va la modifier dans la boucle ci-dessous.
    */
    let current = '';

    /*
      forEach : méthode pour itérer (parcourir) chaque élément d'une liste.
      Syntaxe : liste.forEach((élément) => { ... })
      
      "=>" est une "arrow function" (fonction fléchée), une syntaxe raccourcie de function().
      
      Pour chaque section, on vérifie si l'utilisateur a scrollé jusqu'à elle.
    */
    sections.forEach((section) => {

        /*
          section.offsetTop : position du haut de la section par rapport au haut de la page (en px).
          
          On soustrait 120px pour "anticiper" la transition :
          Le lien actif change légèrement AVANT d'atteindre exactement le bord de la section.
          → Donne une impression plus naturelle.
          
          Si on a scrollé plus loin que le début de cette section,
          on met à jour "current" avec l'id de cette section.
          
          ⚠️ La boucle continue jusqu'à la fin : "current" sera toujours
          l'id de la DERNIÈRE section qu'on a dépassée.
          → C'est bien la section actuellement visible.
        */
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
            // section.id retourne la valeur de l'attribut id (ex: "about", "skills")
        }
    });

    /*
      Maintenant on met à jour l'apparence des liens de nav.
      Pour chaque lien, on vérifie s'il correspond à la section active.
    */
    navLinks.forEach((link) => {

        /*
          link.getAttribute('href') : retourne la valeur de l'attribut href du lien.
          Ex: pour <a href="#about">, retourne la string "#about"
          
          `#${current}` : template literal (littéral de gabarit).
          Les backticks ` permettent d'insérer des variables dans une string.
          ${current} est remplacé par la valeur de current.
          Ex: si current = "about", `#${current}` = "#about"
          
          === : comparaison stricte (valeur ET type identiques).
          À préférer à == (comparaison souple qui peut faire des conversions imprévues).
          
          isActive = true si le href du lien correspond à la section active, false sinon.
        */
        const isActive = link.getAttribute('href') === `#${current}`;

        /*
          classList.toggle('active', isActive) :
          - Si isActive est true  → ajoute la classe "active" au lien
          - Si isActive est false → retire la classe "active" du lien
          
          Le CSS de .nav-links a.active met la couleur jaune.
        */
        link.classList.toggle('active', isActive);
    });
}


// -----------------------------------------------------------
// Attacher les fonctions à l'événement "scroll"
// -----------------------------------------------------------

/*
  addEventListener : écoute un événement et exécute une fonction quand il se produit.
  Syntaxe : element.addEventListener('événement', callback, options)
  
  'scroll' : se déclenche à chaque mouvement de scroll.
  
  La callback ici est une arrow function anonyme qui appelle nos deux fonctions.
  
  { passive: true } : option de performance.
  Informe le navigateur qu'on n'appelle JAMAIS event.preventDefault() dans ce listener.
  → Le navigateur peut optimiser le scroll sans attendre notre JS.
  → Le scroll devient plus fluide, surtout sur mobile.
  
  Note : l'événement "scroll" peut se déclencher des dizaines de fois par seconde.
  C'est pourquoi nos fonctions doivent être rapides à exécuter.
*/
window.addEventListener('scroll', () => {
    handleNavBackground();
    updateActiveLink();
}, { passive: true });


// ============================================================
// 2. ANIMATIONS AU SCROLL (Intersection Observer)
// ============================================================

/*
  POURQUOI L'INTERSECTION OBSERVER ?
  
  Avant, on calculait manuellement dans l'événement "scroll" si un élément
  était visible — mais c'est lent car ça s'exécute des dizaines de fois par seconde.
  
  L'Intersection Observer est une API moderne du navigateur :
  → Le navigateur surveille lui-même si des éléments entrent/sortent du viewport.
  → Il appelle notre callback SEULEMENT quand ça change.
  → Beaucoup plus performant.
  
  Syntaxe :
    const observer = new IntersectionObserver(callback, options);
    observer.observe(element); // Commence à observer cet élément
*/
const revealObserver = new IntersectionObserver(

    /*
      CALLBACK : fonction appelée quand un élément observé change d'état.
      Elle reçoit "entries" : un tableau d'objets décrivant chaque changement.
      (Peut recevoir plusieurs changements en même temps.)
    */
    (entries) => {
        entries.forEach((entry) => {

            /*
              entry.isIntersecting : booléen (true/false).
              true  = l'élément est DANS le viewport (visible à l'écran)
              false = l'élément est hors viewport
            */
            if (entry.isIntersecting) {

                // Ajoute la classe "visible" → le CSS anime l'apparition
                entry.target.classList.add('visible');
                // entry.target = l'élément DOM qui est entré dans le viewport

                /*
                  unobserve : arrête d'observer cet élément.
                  Une fois l'animation jouée, inutile de continuer à le surveiller.
                  → Optimisation mémoire/performance.
                  → L'animation ne se rejoue PAS si l'utilisateur remonte.
                  (Comportement voulu : l'animation ne joue qu'une fois.)
                */
                revealObserver.unobserve(entry.target);
            }
        });
    },

    /*
      OPTIONS de l'observer :
      threshold : 0.15 = l'observer se déclenche quand 15% de l'élément est visible.
      
      threshold peut être :
        - 0   → dès que 1px de l'élément est visible
        - 0.5 → quand 50% est visible
        - 1   → seulement quand l'élément est entièrement visible
        - [0, 0.25, 0.5, 0.75, 1] → plusieurs seuils à la fois
    */
    { threshold: 0.15 }
);

/*
  On attache l'observer à chaque élément ayant la classe "reveal".
  querySelectorAll retourne une NodeList → on forEach pour chaque élément.
*/
document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
    // → le navigateur surveille maintenant cet élément
});


// ============================================================
// 3. INIT — Révéler les éléments déjà visibles au chargement
// ============================================================

/*
  PROBLÈME :
  L'IntersectionObserver ne se déclenche que lors d'un CHANGEMENT de visibilité.
  Les éléments visibles DÈS LE CHARGEMENT (ex: section hero) ne déclenchent pas
  le callback → ils restent en opacity: 0.
  
  SOLUTION :
  On vérifie manuellement au chargement de la page quels éléments .reveal
  sont déjà dans le viewport, et on leur ajoute directement .visible.
  
  'DOMContentLoaded' : événement déclenché quand le HTML est entièrement
  analysé et le DOM construit.
  → Plus précoce que 'load' (qui attend aussi images, CSS, etc.)
  → On peut déjà cibler tous les éléments du DOM.
  
  Note : comme ce <script> est en fin de body, le DOM est déjà construit
  quand ce code s'exécute. DOMContentLoaded est donc immédiat ici.
  Mais c'est une bonne pratique de l'utiliser quand même.
*/
window.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.reveal').forEach((el) => {

        /*
          getBoundingClientRect() : retourne un objet avec les coordonnées
          de l'élément RELATIVES au viewport (fenêtre visible).
          
          rect.top = distance entre le haut du viewport et le haut de l'élément.
          - Si rect.top < 0 → l'élément est au-dessus de la fenêtre (scrollé au-delà)
          - Si rect.top < window.innerHeight → l'élément est dans la fenêtre visible
          - Si rect.top > window.innerHeight → l'élément est en dessous (pas encore visible)
          
          window.innerHeight = hauteur du viewport en pixels.
        */
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight) {
            // L'élément est déjà visible → on l'affiche immédiatement
            el.classList.add('visible');
        }
    });
});