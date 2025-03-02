import { Plus, ArrowUpRightFromSquareIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Trash, PenBox } from "lucide-react";
import ConfirmAlert from "../components/ui components/ConfirmAlert";
import EditPersonne from "./EditPersonne";
import AjouterPersonne from "./AjouterPersonne";

export default function Personnes() {
  const [personnes, setPersonnes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false);
  const [isEditPersonneProjetOpen, setIsEditPersonneProjetOpen] =
    useState(false);
  const [personneToEdit, setPersonneToEdit] = useState({
    id: "",
    nom: "",
    prenom: "",
    telephone: "",
    ville: "",
    villeOption : ""
  });
  const [personneToDelete, setPersonneToDelete] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/personnes", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPersonnes(res.data.data);
    });
  },[]);

  function supprimerPersonne(personne) {
    axios
      .delete(`http://127.0.0.1:8000/api/personnes/${personne.id}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setPersonnes(personnes.filter((p) => p.id !== personne.id));
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }
  return (
    <>
      <div className="p-4">
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Personnes</h1>
            <button
              className="inline-flex items-center px-4 py-2 cursor-pointer border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-500 hover:bg-brand-500"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une personne
            </button>
          </div>

          <div className="bg-white shadow rounded-lg ">
            <div className="overflow-x-auto ">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prenom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telephone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {personnes?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Aucune personne trouvé
                      </td>
                    </tr>
                  ) : (
                    personnes.map((personne) => (
                      <tr key={personne.id} className=" hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {personne.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {personne.prenom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {personne.telephone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {personne.ville}
                          </div>
                        </td>
                        <td className=" whitespace-nowrap text-left text-sm font-medium flex flex-wrap">
                          <Link
                            to={`/personnes/${personne.id}`}
                            className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-6 py-4 border-x border-gray-200 flex flex-1"
                          >
                            <ArrowUpRightFromSquareIcon className="h-5 w-5 mr-2" />
                            Details
                          </Link>
                          <button
                            className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-6 py-4 border-x border-gray-200 flex flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPersonneToEdit(personne);
                              setIsEditPersonneProjetOpen(true);
                            }}
                          >
                            <PenBox className="h-5 w-5 mr-2" />
                            Modifier
                          </button>
                          <button
                            className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-6 py-4 border-x border-gray-200 flex flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsConfirmAlertOpen(true);
                              setPersonneToDelete(personne);
                            }}
                          >
                            <Trash className="h-5 w-5 mr-2" />
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          {
            isModalOpen && (
              <AjouterPersonne
                        setIsModalOpen={setIsModalOpen}
                        setPersonnes={setPersonnes}
                        personnes={personnes}
                      />
            )
          }
          {
            isConfirmAlertOpen && (
              <ConfirmAlert
                onClose={() => {
                  setIsConfirmAlertOpen(false);
                  setPersonneToDelete(null);
                }}
                onConfirm={() => {
                  if (personneToDelete !== null) {
                    supprimerPersonne(personneToDelete);
                    setIsConfirmAlertOpen(false);
                  }
                }}
                title={"Supprimer un projet"}
                // spell-checker: disable
                message={`Êtes-vous sûr de vouloir supprimer cette personne?`}
                // spell-checker: enable
              />
            )
          }
          {
            isEditPersonneProjetOpen && (
              <EditPersonne
                setIsModalOpen={setIsEditPersonneProjetOpen}
                setPersonnes={setPersonnes}
                personnes={personnes}
                personne={personneToEdit}
                setPersonne={setPersonneToEdit}
              />
            )
          }
        </div>
      </div>
    </>
  );
}
