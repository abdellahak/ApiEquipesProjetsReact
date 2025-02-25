import { Link, useNavigate } from "react-router-dom";
import { Plus, Filter, Trash, PenBox, UserPlus, Pointer } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

import AjouterProjet from "./AjouterProjet";
import ConfirmAlert from "../components/ui components/ConfirmAlert";
import EditProjet from "./EditProjet";
import AffecterMembres from "./AffecterMembres";

function getStatusIcon(status) {
  switch (status) {
    case "Terminé":
      return <span className="text-green-500">✔️</span>;
    case "En Cours":
      return <span className="text-yellow-500">⏳</span>;
    case "Pas Commencé":
      return <span className="text-gray-500">❌</span>;
    default:
      return <span className="text-gray-500">❓</span>;
  }
}

export default function Projets() {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalProjetOpen, setIsEditModalProjetOpen] = useState(false);
  const [isAffecterMembresModalOpen, setIsAffecterMembresModalOpen] =
    useState(false);
  const [projectToEdit, setProjectToEdit] = useState({
    id: "",
    intitule: "",
    date_debut: "",
    duree: 1,
  });
  const [isFinishModalProjetOpen, setIsFinishModalProjetOpen] = useState(false);
  const [projectToFinish, setProjectToFinish] = useState(null);
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isConfirmReniataliserAlertOpen, setIsConfirmReniataliserAlertOpen] = useState(false);
  const [projectToReniataliser, setProjectToReniataliser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/projets")
      .then((res) => setProjects(res.data?.data || []))
      .catch((err) =>
        console.error("Erreur lors de la récupération des projets:", err)
      );
  }, []);

  useEffect(() => {
    if (statusFilter === "Tous") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(
          (project) =>
            calculateProjectStatus(
              project.date_debut,
              project.duree,
              project.date_fin
            ) === statusFilter
        )
      );
    }
  }, [statusFilter, projects]);

  const statusOptions = ["Tous", "Terminé", "Pas Commencé", "En Cours"];

  function calculateProjectStatus(startDate, duration, endDate = null) {
    const start = new Date(startDate);
    const today = new Date();
    const calculatedEndDate = new Date(
      start.getTime() + duration * 24 * 60 * 60 * 1000
    );
    const finalEndDate = endDate ? new Date(endDate) : calculatedEndDate;

    if (today < start) {
      return "Pas Commencé";
    }

    if (today > finalEndDate && endDate) {
      return "Terminé";
    }

    return "En Cours";
  }

  function supprimerProjet(projet) {
    axios
      .delete(`http://127.0.0.1:8000/api/projets/${projet.id}`)
      .then(() => {
        setProjects(projects.filter((p) => p.id !== projet.id));
      })
      .catch((err) => {
        alert("Failed to delete the project. Please try again.");
      });
  }

  function terminerProjet(projet) {
    const today = new Date().toISOString().split("T")[0];
    axios
      .patch(`http://127.0.0.1:8000/api/projets/${projet.id}`, {
        date_fin: today,
      })
      .then(() => {
        setProjects(
          projects.map((p) =>
            p.id === projet.id ? { ...p, date_fin: today } : p
          )
        );
      })
      .catch((err) => {
        console.log(new Date());
        console.log(err);
        alert("Failed to finish the project. Please try again.");
      });
  }

  function reniataliserDateFinDeProjet(projet) {
    axios.patch(`http://127.0.1:8000/api/projets/${projet.id}`, {
        date_fin:null,
    }).then(()=>{
      setProjects(
        projects.map((p) =>
          p.id === projet.id ? { ...p, date_fin: null } : p
        )
      );
    })
    .catch((err) => {
      console.log(new Date());
      console.log(err);
      alert("Failed to finish the project. Please try again.");
    });
  }



  function isEnRetard(project) {
    const currentDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(project.date_debut).toISOString().split("T")[0];
    if (project.date_fin) {
      const endDate = new Date(project.date_fin).toISOString().split("T")[0];
      const realDuration = Math.floor(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
      return realDuration > project.duree;
    }
    const realDuration = Math.floor(
      (new Date(currentDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    return realDuration > project.duree;
  }
  return (
    <div className="p-4">
      <div className="space-y-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
          <button
            className="inline-flex items-center px-4 py-2 cursor-pointer border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un projet
          </button>
        </div>

        <div className="bg-white shadow rounded-lg ">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      statusFilter === status
                        ? "bg-brand-100 text-brand-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status === "Tous" ? "Tous" : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de début
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de fin
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée (jours)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-center text-sm text-gray-500"
                    >
                      Aucun projet trouvé
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className=" hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(
                            calculateProjectStatus(
                              project.date_debut,
                              project.duree,
                              project.date_fin
                            )
                          )}
                          <span className="ml-2 text-sm text-gray-500 flex gap-0.5">
                            {calculateProjectStatus(
                              project.date_debut,
                              project.duree,
                              project.date_fin
                            )}
                          </span>
                          {isEnRetard(project) && (
                            <p className="text-amber-600 text-xs ml-1">
                              (<span className="text-red-500">⚠️</span>
                              En Retard )
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {project.intitule}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(project.date_debut).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap overflow-hidden">
                        {project.date_fin ? (
                          <div className="text-sm group relative w-full h-fit ">
                            <div className="px-3 py-4  text-gray-500">
                              {new Date(project.date_fin).toLocaleDateString()}
                            </div>
                            <div className="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button className="text-brand-600  hover:bg-brand-100 px-3 py-4 border-x border-gray-200 flex flex-1"
                              onClick={()=>{
                                setIsConfirmReniataliserAlertOpen(true);
                                setProjectToReniataliser(project);
                              }}
                              >
                              <Trash className="h-5 w-5 mr-2" />
                                Réinitialiser
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            to={`/projects/${project.id}`}
                            className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-3 py-4 border-x border-gray-200 flex flex-1 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFinishModalProjetOpen(true);
                              setProjectToFinish(project);
                            }}
                          >
                            <Pointer className="h-5 w-5 mr-2" />
                            Terminer
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.duree}
                      </td>
                      <td className=" whitespace-nowrap text-left text-sm font-medium flex flex-wrap">
                        <button
                          className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-3 py-4 border-x border-gray-200 flex flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToEdit(project);
                            setIsAffecterMembresModalOpen(true);
                          }}
                        >
                          <UserPlus className="h-5 w-5 mr-2" />
                          Membres
                        </button>
                        <button
                          className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-3 py-4 border-x border-gray-200 flex flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToEdit(project);
                            setIsEditModalProjetOpen(true);
                          }}
                        >
                          <PenBox className="h-5 w-5 mr-2" />
                          Modifier
                        </button>
                        <button
                          to={`/projects/${project.id}`}
                          className="text-brand-600 hover:text-brand-900  hover:bg-brand-100 px-3 py-4 border-x border-gray-200 flex flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsConfirmAlertOpen(true);
                            setProjectToDelete(project);
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
        {isModalOpen && (
          <AjouterProjet
            setIsModalOpen={setIsModalOpen}
            setProjects={setProjects}
            projects={projects}
          />
        )}
        <EditProjet
          isModalOpen={isEditModalProjetOpen}
          setIsModalOpen={setIsEditModalProjetOpen}
          setProjects={setProjects}
          projects={projects}
          project={projectToEdit}
          setProject={setProjectToEdit}
        />
        {isAffecterMembresModalOpen && (
          <AffecterMembres
            setIsModalOpen={setIsAffecterMembresModalOpen}
            setProjects={setProjects}
            projects={projects}
            project={projectToEdit}
            setProject={setProjectToEdit}
          />
        )}
        {isConfirmAlertOpen && (
          <ConfirmAlert
            onClose={() => {
              setIsConfirmAlertOpen(false);
              setProjectToDelete(null);
            }}
            onConfirm={() => {
              if (projectToDelete !== null) {
                supprimerProjet(projectToDelete);
                setIsConfirmAlertOpen(false);
              }
            }}
            title={"Supprimer un projet"}
            message={`Êtes-vous sûr de vouloir supprimer le projet ${
              projectToDelete?.intitule ?? ""
            } ?`}
          />
        )}
        {isFinishModalProjetOpen && (
          <ConfirmAlert
            onClose={() => {
              setIsFinishModalProjetOpen(false);
              setProjectToFinish(null);
            }}
            onConfirm={() => {
              if (projectToFinish !== null) {
                terminerProjet(projectToFinish);
                setIsFinishModalProjetOpen(false);
              }
            }}
            title={"Terminer un projet"}
            message={`Êtes-vous sûr de vouloir terminer le projet ${
              projectToFinish?.intitule ?? ""
            } ?`}
          />
        )}
        {
          isConfirmReniataliserAlertOpen && (
            <ConfirmAlert
              onClose={() => {
                setIsConfirmReniataliserAlertOpen(false);
                setProjectToReniataliser(null);
              }}
              onConfirm={() => {
                if (projectToReniataliser !== null) {
                  reniataliserDateFinDeProjet(projectToReniataliser);
                  setIsConfirmReniataliserAlertOpen(false);
                }
              }}
              title={"Réinitialiser la date de fin d'un projet"}
              message={`Êtes-vous sûr de vouloir réinitialiser la date de fin du projet ${
                projectToReniataliser?.intitule ?? ""
              } ?`}
            />
          )
        }
      </div>
    </div>
  );
}
