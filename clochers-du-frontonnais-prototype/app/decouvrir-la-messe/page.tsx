// app/decouvrir-la-messe/page.tsx
export default function DecouvrirLaMesse() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold">Découvrir la messe à Fronton</h1>
        <p className="mt-3 opacity-80">
          Bienvenue ! Cette page explique simplement le déroulement d’une messe dans l’ensemble paroissial de Fronton – Villemur.
        </p>

        <section className="mt-6 space-y-4">
          <article className="card p-6">
            <h2 className="text-xl font-semibold">1. Accueil</h2>
            <p className="mt-2">Arrivez 5–10 min avant. Prenez un feuillet si disponible, coupez la sonnerie du téléphone, installez-vous.</p>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-semibold">2. Liturgie de la Parole</h2>
            <p className="mt-2">Première lecture, psaume, deuxième lecture (selon les jours) et Évangile. Une homélie aide à comprendre.</p>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-semibold">3. Liturgie de l’Eucharistie</h2>
            <p className="mt-2">Offertoire, prière eucharistique, Notre Père, communion. Si vous ne communiez pas, avancez les bras croisés pour une bénédiction.</p>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-semibold">4. Conseils pratiques</h2>
            <ul className="list-disc pl-5 mt-2">
              <li>Les enfants sont les bienvenus.</li>
              <li>Renseignez-vous pour le catéchisme et l’aumônerie.</li>
              <li>Un prêtre est disponible à la fin pour échanger.</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
