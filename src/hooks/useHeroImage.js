import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useHeroImage() {
  const router = useRouter();
  const [heroImages, setHeroImages] = useState({});

  useEffect(() => {
    fetch('/api/navbar-images')
      .then(res => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      })
      .then(data => {
        if (data.images) {
          setHeroImages(data.images);
        }
      })
      .catch(err => console.error('Erreur chargement images hero:', err));
  }, []);

  const getHeroImage = () => {
    const path = router.pathname;
    let pageSlug = 'accueil';

    if (path === '/') pageSlug = 'accueil';
    else if (path === '/demarches') pageSlug = 'demarches';
    else if (path === '/ecoles') pageSlug = 'ecoles';
    else if (path === '/commerces') pageSlug = 'commerces';
    else if (path === '/intercommunalite') pageSlug = 'intercommunalite';
    else if (path === '/associations') pageSlug = 'associations';
    else if (path === '/decouvrir_friesen') pageSlug = 'decouvrir_friesen';
    else if (path === '/infos_pratiques') pageSlug = 'infos_pratiques';

    return heroImages[pageSlug] || '/village.jpeg';
  };

  return getHeroImage();
}
