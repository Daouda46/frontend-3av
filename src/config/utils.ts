import moment from "moment";



export const formaterDate = (date: string | Date | null | undefined): string => {
  // Si la date est null ou indéfinie, renvoyer une valeur par défaut
  if (!date) {
    return "Non renseignée";
  }

  // Si la date est une chaîne, tenter de la convertir en objet Date
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Vérifier si l'objet Date est valide
  if (isNaN(parsedDate.getTime())) {
    return "Date invalide"; // Si la conversion échoue, afficher un message
  }

  // Utiliser moment pour formater la date
  return moment(parsedDate).format("DD/MM/YYYY");
};

export const convertDaysToMonths = (days: number): number => {
  const daysInMonth = 30;
  return parseFloat((days / daysInMonth).toFixed(2));
};



  export const formatageMontantCFA = (montant: number): string => {
      //arrondit le montant à deux décimales
    var p = montant.toFixed(2).split(".");
 //diviser le montant en deux partie 'entier' et 'decimale' puit utilser la partie entière pour la inverser en un table
    return p[0].split("").reverse().reduce((acc, montant, i) => {
        //reconstruire la chaîne de caractères tout en ajoutant des séparateurs de milliers
      return montant == "-" ? acc : montant + (i && !(i % 3) ? "." : "") + acc;
    }, "") + " F CFA";
  }

  


  export const formatageMontant = (montant: number): string => {
    // Extraire la partie entière sans les décimales
    const partieEntiere = Math.trunc(montant).toString();
    
    // Inverser la partie entière pour ajouter les séparateurs de milliers
    const partieEntiereFormattee = partieEntiere
      .split("")
      .reverse()
      .reduce((acc, chiffre, i) => {
        return chiffre === "-" ? acc : chiffre + (i && !(i % 3) ? "." : "") + acc;
      }, "");
  
    return partieEntiereFormattee;
  };


//formater la date de la realisation (JJ/MM/AA)
export function dateDuJour(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
//formater la date de la realisation (JJ/MM/AA)
export function dateDuJourFormatAnglais(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`
}

