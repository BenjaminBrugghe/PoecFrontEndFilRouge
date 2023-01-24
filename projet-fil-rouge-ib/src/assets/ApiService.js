import axios from "axios";
const _url = "http://localhost:3001";

export default class Service {
  // ********** Utilisateurs **********

  /**
   * Récupère la liste des utilisateurs (clients et admin)
   * @returns La liste des utilisateurs
   */
  async recupererUtilisateurs() {
    const response = await axios.get(_url + "/utilisateurs");
    const utilisateurs = await response.data;
    return utilisateurs;
  }

  /**
 * Récupère l'utilisateur correspondant à l'id
 * @param {number} id L'id de l'utilisateur à rechercher
 * @returns L'utilisateur correspondant à l'id
 */
  async recupererUtilisateurById(id) {
    const response = await this.recupererUtilisateurs();
    const utilisateur = await response.find(
      (utilisateur) => utilisateur.id === id
    );
    return utilisateur;
  }

  /**
   * Récupère la liste des prestataires
   * @returns La liste des prestataires
   */
  async recupererPrestataires() {
    const response = await axios.get(_url + "/prestataires");
    const prestataires = await response.data;
    return prestataires;
  }

  /**
   * Récupère le prestataire correspondant à l'id
   * @param {number} id 
   * @returns Le prestataire correspondant à l'id
   */
  async recupererPrestataireById(id) {
    const response = await this.recupererPrestataires();
    const prestataire = await response.find(
      (prestataire) => prestataire.id === id
    );
    return prestataire;
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Utilisateurs} utilisateur L'utilisateur à créer
   * @returns L'utilisateur qui vient d'être créé
   */
  async creerUtilisateur(utilisateur) {
    return axios
      .post(_url + "/utilisateurs", utilisateur)
      .then((res) => res.data);
  }

  /**
   * Crée un nouveau prestataire
   * @param {Prestaires} prestataire Le prestataire à créer
   * @returns Le prestataire qui vient d'être créé
   */
  async creerPrestataire(prestataire) {
    return axios
      .post(_url + "/prestataires", prestataire)
      .then((res) => res.data);
  }

  /**
   * Ajoute une prestation au panier de l'utilisateur
   * @param {number} id L'id de l'utilisateur
   * @param {Prestation} prestation La prestation à ajouter au panier
   * @returns L'utilisateur avec son panier modifié
   */
  async ajouterPrestationAuPanier(id, prestation) {
    const utilisateur = await this.recupererUtilisateurById(id);
    utilisateur.panier.push(prestation);
    const response = await axios.put(_url + `/utilisateurs/${id}`, utilisateur);
    const utilisateurModifie = response.data;
    return utilisateurModifie;
  }

  /**
   * Récupère le panier du client
   * @param {Utilisateurs} client Le client
   * @returns Le panier du client
   */
  async recupererPanierClient(client) {
    const prestations = await this.recupererPrestations();
    const panierClient = await prestations.filter(
      (prestation) => prestation.client === client.nom && prestation.etat !== "Disponible"
    );
    return panierClient;
  }

  /**
   * Récupère le panier du prestataire
   * @param {Prestataires} prestataire 
   * @returns Le panier du prestataire
   */
  async recupererPanierPrestataire(prestataire) {
    const prestations = await this.recupererPrestations();
    const panierPrestataire = await prestations.filter(
      (prestation) => prestation.prestataire === prestataire.nomSociete && prestation.etat !== "Disponible"
    );
    return panierPrestataire;
  }

  // ************************** Prestations **************************

  /**
   * Récupère la liste des prestations
   * @returns La liste des prestations
   */
  async recupererPrestations() {
    const response = await axios.get(_url + "/prestations");
    const prestatations = await response.data;
    return prestatations;
  }

  /**
   * Récupère la liste des prestations disponibles
   * @returns La liste des prestations disponibles
   */
  async recupererPrestationsDisponibles() {
    const response = await this.recupererPrestations();
    const prestationsDisponibles = response.filter(
      (prestation) => prestation.etat === "Disponible"
    );
    return prestationsDisponibles;
  }

  /**
   * Récupère la liste des prestations en cours, terminées ou archivées
   * @returns La liste des prestations en cours, terminées ou archivées
   */
  async recupererPrestationsEnCoursOuTerminees() {
    const response = await this.recupererPrestations();
    const prestationsEnCoursOuTerminees = response.filter(
      (prestation) =>
        prestation.etat === "En cours" ||
        prestation.etat === "Terminée" ||
        prestation.etat === "Archivée"
    );
    return prestationsEnCoursOuTerminees;
  }

  /**
   * Crée une nouvelle prestation
   * @param {Prestations} prestation 
   * @returns La prestation qui vient d'être créée
   */
  async creerPrestations(prestation) {
    return axios
      .post(_url + "/prestations", prestation)
      .then((res) => res.data);
  }

  /**
   * Modifie une prestation
   * @param {number} id L'id de la prestation à modifier
   * @param {string | number | boolean} informations Les informations à modifier (etat, validationPrestataire, validationClient, noteQualiteGlobale, noteCommunication, noteDossierTechnique, noteExpertise, noteMoyenne)
   * @returns La prestation modifiée
   */
  async modifierPrestations(id, informations) {
    const response = await axios.patch(
      _url + `/prestations/${id}`,
      informations
    );
    const prestationModifiee = response.data;
    return prestationModifiee;
  }

  /**
   * Ajoute les notes pour la prestation
   * @param {Prestations} prestationNotee La prestation à noter
   * @returns La prestation après modifications
   */
  async noterPrestation(prestationNotee) {

    const response = await axios.put(
      _url + `/prestations/${prestationNotee.id}`,
      prestationNotee
    );
    const prestationModifiee = response.data;
    return prestationModifiee;
  }
}
