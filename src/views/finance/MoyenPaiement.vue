<template>
    <div>
        <Loader :isLoading="isLoading" />
        <div class="row mb-4">
        <div>
            <h3>Liste des fonctions</h3>
        </div>
      <div class="col-12 d-flex justify-content-end"> <!-- Utilisation de flex pour aligner à droite -->
        <button type="button" class="btn btn-primary add-button" @click="showModal">Ajouter</button>
      </div>
         </div>
              <div class="row">
             <div class="table-responsive">
         
             <table class="table table-hover align-middle">
      <thead class="table-light">
       <tr>
          <th class="p-2 border">N°</th>
          <th class="p-2 border">Code</th>
          <th class="p-2 border">Libellé</th>
          <th class="p-2 border" style="margin-left:50%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in fonctionStore.getterFonction" :key="item.id">
          <td class="fw-semibold">{{ index + 1 }}</td>
          
          <td>
            <span class="d-flex" style="margin-left:40%" >
              {{ item.code }}
            </span>
          </td>
          <td>
            <span class="d-flex" style="margin-left:40%" >
              {{ item.libelle }}
            </span>
          </td>
          
         <td class="text-end">
                    <div class="btn-group btn-group-md">
                      
                      <button @click="showEditModal(item.id)" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-pencil-square"></i> Modifier
                        </button>
                        &nbsp;&nbsp;
                      <button class="btn btn-outline-danger" @click="supprimer(item.id)">
                        <i class="bi bi-trash"></i>Supprimer
                      </button>
                    </div>
                  </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- //**
*  DEBUT  DU MODAL D'ENREGISTREMENT
*/ -->
<div class="modal" id="disabledAnimation" tabindex="-1" data-bs-backdrop="static" data-keyboard="false" ref="modalRef"
>
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title margin-left:20%">Enregistrement de la fonction</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <form class="row g-3 needs-validation">
        <div class="col-md-12">
          <label class="form-label" for="validationCustom01"
            >Code <span style="color: red">*</span>

          </label>
          <span v-for="(error, errorIndex) in $v.code.$errors" :key="errorIndex">
                <span style="color: red">Ce champs est obligatoire</span>
          </span>
          <input
            class="form-control"
            id="validationCustom01"
            type="text"
            placeholder="Entrez le code"
            v-model="form.code"
            
          />
           
          </div>
        <div class="col-md-12">
          <label class="form-label" for="validationCustom02"
            >Libellé <span style="color: red">*</span></label
          >
          <span v-for="(error, errorIndex) in $v.libelle.$errors" :key="errorIndex">
                <span style="color: red">Ce champs est obligatoire</span>
          </span>
          <input
            class="form-control"
            id="validationCustom02"
            type="text"
            placeholder="Entrez le libellé"
           v-model="form.libelle"
          />
            
        </div>
      </form>
    </div>
    <div class="modal-footer">
       <button
         type="button"
         class="btn btn-secondary"
         data-bs-dismiss="modal"
          >
         Fermer
       </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="AjouterFonctionLocal"
      >
        Enregistrer
      </button>
    </div>
  </div>
</div>
</div>
<!-- //**
*  FIN  DU MODAL D'ENREGISTREMENT
*/ -->
<!-- //**
*  DEBUT  DU MODAL D'ENREGISTREMENT
*/ -->
<div class="modal" id="disabledAnimation" tabindex="-1" data-bs-backdrop="static" data-keyboard="false" ref="modalRefEdit"
>
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title margin-left:20%">Modification de la fonction</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <form class="row g-3 needs-validation">
        <div class="col-md-12">
          <label class="form-label" for="validationCustom01"
            >Code <span style="color: red">*</span>

          </label>
          <span v-for="(error, errorIndex) in $v_edit.code.$errors" :key="errorIndex">
                <span style="color: red">Ce champs est obligatoire</span>
          </span>
          <input
            class="form-control"
            id="validationCustom01"
            type="text"
            placeholder="Entrez le code"
            v-model="formEdit.code"
            
          />
           
          </div>
        <div class="col-md-12">
          <label class="form-label" for="validationCustom02"
            >Libellé <span style="color: red">*</span></label
          >
          <span v-for="(error, errorIndex) in $v_edit.libelle.$errors" :key="errorIndex">
                <span style="color: red">Ce champs est obligatoire</span>
          </span>
          <input
            class="form-control"
            id="validationCustom02"
            type="text"
            placeholder="Entrez le libellé"
           v-model="formEdit.libelle"
          />
            
        </div>
      </form>
    </div>
    <div class="modal-footer">
       <button
         type="button"
         class="btn btn-secondary"
         data-bs-dismiss="modal"
          >
         Fermer
       </button>
      <button
        type="button"
        class="btn btn-success"
        @click="ModifierFonctionLocal"
      >
        Modifier
      </button>
    </div>
  </div>
</div>
</div>
<!-- //**
*  FIN  DU MODAL D'ENREGISTREMENT
*/ -->

    </div>
</template>
<script setup lang="ts">
import { Modal } from "bootstrap";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref, reactive, onMounted } from 'vue';
import {Fonction} from '../../shared/interfaces/index'
import {useFonction} from '../../stores/parametrage/fonction'
import Swal from 'sweetalert2'

const fonctionStore = useFonction();

const modalRef = ref<HTMLDivElement | null>(null);
const modalRefEdit = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const form = reactive<Fonction>({
    id: 0,
    code: '',
    libelle:''
});
const formEdit = reactive<Fonction>({
    id: 0,
    code: '',
    libelle:''
});

const items = ref([
  {
    id: 1,
    code: 'F1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    libelle: 'Developpeur',
    date: '2023-05-15'
  },
  {
    id: 2,
    code: 'F2',
    avatar: 'https://i.pravatar.cc/150?img=2',
    libelle: 'Comptable',
    date: '2023-06-20'
  }
]);
//appel modal d'enregistrement
const showModal = () => {
  if (modalRef.value) {
    const modalInstance = new Modal(modalRef.value);
    modalInstance.show();
  }
};
// fonction pour vider les champs
function annulerChamp() {
  $v.value.$reset();
  (form.code = ""),
    (form.libelle = "")  
};
//Ajouter fonction
function AjouterFonctionLocal() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    try {
      console.log(form);
       isLoading.value = true;
      fonctionStore.AjouterFonction(form).then(() => {
        isLoading.value = false;
        annulerChamp();
      });
    } catch (error) {
      console.error("Echec d'enregistrement:", error);
    //   isLoading.value = false;
    }
  }
}
// fonction pour vider les champs
function annulerChampEdit() {
  $v.value.$reset();
  (formEdit.code = ""),
    (formEdit.libelle = "")  
};
//Fonction de fermeture du modal après modification
const closeModal = () => Modal.getInstance(modalRefEdit.value)?.hide();
  // fonction de modification dans la base
  function ModifierFonctionLocal() {
    $v_edit.value.$touch();
    if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true;
      fonctionStore.modifierFonction(formEdit).then(() => {
          isLoading.value = false;
        //    annulerChampEdit();
           closeModal();
        });
         // Fermer le modal après modification
     
    } catch (error) {
      console.error("Login failed:", error);
      isLoading.value = false;
    }
  }else{
    console.log($v);
  }

  }
const showEditModal = (id: number) => {
   // recherche de l'id selectionné dans le getter
   const data = fonctionStore.getterFonction.find((item)=> item.id === id);
   
   if(data){
    // on remplit les champs du formulaire avec les données de la nature de dépense selectionnée
    formEdit.id= data.id;
    formEdit.code = data.code;
    formEdit.libelle = data.libelle;

    if (modalRefEdit.value) {
        const modalInstance = new Modal(modalRefEdit.value);
        modalInstance.show();
    }else {
      console.error(`Modal reference not found for id ${id}`);
    }
  } else {
    console.error(`Data with id ${id} not found`);
  } 
}
// fonction de suppression dans la bd
function supprimer(id: number) {
  Swal.fire({
    title: "Suppression",
    text: "êtes-vous sûr de vouloir effectuer cette action ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, Supprimer",
    cancelButtonText: "Annuler !",
    confirmButtonColor: "#FF6150",
    cancelButtonColor: "#969392",
  }).then((res) => {
    if (res.isConfirmed) {
        
        fonctionStore.supprimerFonction(id);
    }
  });
}
const statusClass = (status) => {
  return {
    'bg-success': status === 'actif',
    'bg-danger': status === 'inactif',
    'bg-warning': status === 'en attente'
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const editItem = (item) => {
  console.log('Édition:', item);
};

const deleteItem = (id) => {
  console.log('Suppression:', id);
};

const rules = {
  code: { required },
  libelle: { required },
  
};
const $v = useVuelidate(rules, form);
  //pour la modification
  const rules_edit = {
    code: { required },
    libelle: { required },
  };
  const $v_edit = useVuelidate(rules_edit, formEdit);

onMounted(()=>{
   
    fonctionStore.getFonction();
})
</script>
<style scoped>
.add-button{
    display: inline;
    margin-left: 800%;
}
.full-width-card {
  width: 100%;
  max-width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Espacement entre les sections */
.card-title {
  margin-bottom: 1rem;
  font-weight: 600;
}
.card-body{
    flex: 1 1 auto;
    padding: 30px;
    border-radius: 15px;
}
</style>