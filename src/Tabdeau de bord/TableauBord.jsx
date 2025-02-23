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
    axios.get("http://127.0.0.1:8000/api/personnes").then((res) => {
      setPersonnes(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/projets").then((res) => {
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
                      Total Projects
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
      </div>
    </>
  );
}
