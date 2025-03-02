import { FolderKanban, Users } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

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

export default function TableauBord() {
  const [projects, setProjects] = useState([]);
  const [personnes, setPersonnes] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/personnes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPersonnes(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/projets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setProjects(res.data.data);
    });
  }, []);

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

  const projetsTermines = projects.filter(
    (project) =>
      calculateProjectStatus(project.date_debut, project.duree, project.date_fin) ===
      "Terminé"
  ).length;

  const projetsEnCours = projects.filter(
    (project) =>
      calculateProjectStatus(project.date_debut, project.duree, project.date_fin) ===
      "En Cours"
  ).length;

  const projetsPasCommence = projects.filter(
    (project) =>
      calculateProjectStatus(project.date_debut, project.duree, project.date_fin) ===
      "Pas Commencé"
  ).length;

  const projetsEnRetard = projects.filter((project) => isEnRetard(project)).length;

  return (
    <>
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* total projets */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Projets
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {projects?.length ?? 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* total personnes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Personnes
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {personnes?.length ?? 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* projets terminés */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Projets Terminés
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {projetsTermines}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* projets en cours */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Projets En Cours
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {projetsEnCours}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* projets pas commencé */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Projets Pas Commencé
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {projetsPasCommence}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* projets en retard */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Projets En Retard
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {projetsEnRetard}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Projects
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {projects
                    .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut))
                    .slice(0, 5)
                    .map((project) => (
                      <li key={project.id}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(
                              calculateProjectStatus(
                                project.date_debut,
                                project.duree,
                                project.date_fin
                              )
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 ">
                              {project.intitule}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status:{" "}
                              {calculateProjectStatus(
                                project.date_debut,
                                project.duree,
                                project.date_fin
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Personnes */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Personnes
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {personnes
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5)
                    .map((personne) => (
                      <li key={personne.id}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="text-blue-500">👤</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 ">
                              {personne.nom} {personne.prenom}
                            </p>
                            <p className="text-sm text-gray-500">
                              Telephone: {personne.telephone}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
