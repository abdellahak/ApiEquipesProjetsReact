import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import ConfirmAlert from "../components/ui components/ConfirmAlert";

export default function AffecterMembres({
  setIsModalOpen,
  project,
  setProject,
}) {
  const [membres, setMembres] = useState([]);
  const [personnes, setPersonnes] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [notMembers, setNotMembers] = useState([]);
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false);
  const [membreToDelete, setMembreToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/personnes")
      .then((response) => {
        setPersonnes(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/projet/${project.id}/personnes`)
      .then((response) => {
        setMembres(response.data.personnes);
      })
      .catch((error) => console.error(error));
  }, [project]);

  useEffect(() => {
    setNotMembers(
      personnes.filter((p) => !membres.map((m) => m.id).includes(p.id))
    );
  }, [personnes, membres]);

  function AjouterMembre() {
    axios
      .post(`http://127.0.0.1:8000/api/projets/${project.id}/personne`, {
        personne_id: selectedPerson,
      })
      .then((response) => {
        console.log(response.data.data);
        setMembres([...membres, response.data.data]);
        setSelectedPerson(null);
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  }
  function supprimerMembre(membre) {
    console.log({ personne_id: membre.id });
    axios
      .delete(`http://127.0.0.1:8000/api/projet/${project.id}/personne`, {
        data: {
          personne_id: membre.id,
        },
      })
      .then((response) => {
        setMembres(membres.filter((m) => m.id !== membre.id));
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  }
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999`}
      >
        <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
        <div className="relative w-full max-w-[584px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
          {/* bouton de fermeture */}
          <button className="group absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 sm:right-6 sm:top-6 sm:h-11 sm:w-11">
            <svg
              className="transition-colors fill-current group-hover:text-gray-600 dark:group-hover:text-gray-200 cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setIsModalOpen(false)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              ></path>
            </svg>
          </button>

          <div>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Les Membres de Projet N°{project?.id} :
            </h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prenom
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telephone
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {membres?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-gray-500"
                    >
                      Aucun membre affecté à ce projet
                    </td>
                  </tr>
                ) : (
                  membres.map((membre) => (
                    <tr key={membre.id} className=" hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membre.nom}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membre.prenom}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membre.telephone}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membre.ville}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          className="text-brand-600 hover:text-brand-900  hover:bg-red-100 px-6 py-4 border-x border-gray-200 flex flex-1"
                          onClick={() => {
                            setMembreToDelete(membre);
                            setIsConfirmAlertOpen(true);
                          }}
                        >
                          <Trash2 className="h-5 w-5 mr-2 text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ajouter un membre
                </label>
                <div className="flex gap-3">
                  <select
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    onChange={(e) => {
                      setSelectedPerson(e.target.value);
                    }}
                  >
                    <option value="">Sélectionner une personne</option>
                    {notMembers.map((personne) => (
                      <option key={personne.id} value={personne.id}>
                        {personne.nom} {personne.prenom}
                      </option>
                    ))}
                  </select>
                  {selectedPerson && (
                    <button
                      type="button"
                      className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 sm:w-auto"
                      onClick={AjouterMembre}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {isConfirmAlertOpen && (
            <ConfirmAlert
              isOpen={isConfirmAlertOpen}
              setIsOpen={setIsConfirmAlertOpen}
              title="Supprimer Membre"
              message="Voulez-vous vraiment supprimer ce membre?"
              onConfirm={() => {
                supprimerMembre(membreToDelete);
                setIsConfirmAlertOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
