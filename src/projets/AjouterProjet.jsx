import { useState } from "react";
import axios from "axios";

export default function AjouterProjet({ setIsModalOpen, projects, setProjects }) {
  const [errorMessages, setErrorMessages] = useState({
    intitule: "",
    date_debut: "",
    duree: "",
    otherError: "",
  });
  const [projet, setProjet] = useState({
    intitule: "",
    date_debut: "",
    duree: 1,
  });

  function validateForm(date_debut, currentDate){
    let validated = true;
    const errors = {}
    if (projet.intitule.length === 0) {
      errors.intitule = "L'intitulé est requis";
      validated = false;
    }
    if (!projet.date_debut) {
      errors.date_debut = "La date est requise";
      validated = false;
    }
    if (projet.duree < 1) {
      errors.duree = "La durée doit être supérieure à 0";
      validated = false;
    }
    setErrorMessages(errors);
    return validated;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const currentDate = new Date();
    const date_debut = new Date(projet.date_debut);
    if(validateForm(date_debut, currentDate) === false){
      return;
    }
    axios.post("http://127.0.0.1:8000/api/projets", projet)
    .then((res) => {
      setProjects([...projects, res.data.data]);
      setProjet({
        intitule: "",
        date_debut: "",
        duree: 1,
      });
      setIsModalOpen(false);
    }).catch((err) => {
      setErrorMessages({otherError: err.response?.data?.message || "An error occurred"});
    });
  }
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999`}
      >
        <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
        <div className="relative w-full max-w-[584px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
          {/* close button */}
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

          <form onSubmit={handleSubmit}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Details de Projet : 
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Intitule
                </label>
                <input
                  type="text"
                  placeholder="Titre de projet"
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={projet.intitule}
                  onChange={(e) =>
                    setProjet({ ...projet, intitule: e.target.value })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Date debut
                </label>
                <input
                  type="date"
                  placeholder="Select date"
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={projet.date_debut}
                  onChange={(e) =>
                    setProjet({ ...projet, date_debut: e.target.value })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Durée
                </label>
                <input
                  type="number"
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={projet.duree}
                  onChange={(e) =>
                    setProjet({ ...projet, duree: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="mt-1.5 text-sm text-error-500" id="error-msg">
              <ul>
                {errorMessages.intitule && <li>{errorMessages.intitule}</li>}
                {errorMessages.date_debut && <li>{errorMessages.date_debut}</li>}
                {errorMessages.duree && <li>{errorMessages.duree}</li>}
                {errorMessages.otherError && <li>{errorMessages.otherError}</li>}
              </ul>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <button
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
