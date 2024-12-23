import { authFetch } from "../auth/auth.js";
import {displayErrorMessage, showConfirmationModal} from "../utils.js";
import {showView} from "../views/viewManager.js";

export async function SetupAgentView() {
    setupDeleteConfirmation();

    const response = await authFetch(`/agent`);

    if (!response.ok) {
        if (response.status === 401) {
            displayErrorMessage("Du skal logge ind før vi kan finde dine annonceagenter");
            return;
        }

        if (response.status === 403) {
            displayErrorMessage("Du skal have et abonnement for at oprettet annonceagenter");
            return;
        }

        displayErrorMessage("Der skete en fejl, vi beklager. ");
        return;
    }

    let agents = await response.json();
    console.log(agents);

    const $tableBody = $('#agent-table-body');
    $tableBody.empty(); // Clear previous entries
    if (agents.length > 0) {
        agents.forEach(function (agent) {
            $tableBody.append(createAgentRow(agent));
        });
    } else {
        $tableBody.append('<tr><td colspan="4" class="text-center">No agents found.</td></tr>');
    }
}

function setupDeleteConfirmation() {
    $('#agent-table-body').on('click', '.btn-delete-agent', function() {
        const agentId = $(this).data('agent-id');
        showConfirmationModal(
            'Bekræft sletning',
            'Vil du slette denne annonceagent?',
            () => deleteAgent(agentId)
        );
    });
}


async function editAgent(agentId) {
    const response = await authFetch(`/agent/${agentId}`)
    const agent = await response.json();

    // TODO: text er ikke lagret i agent.criteria endnu fra backend
    document.getElementById('advertisement-list-search-agenteditview').value = agent.criteria.text || '';
    setSliderValue('price-range-slider-agenteditview', agent.criteria.min_price, agent.criteria.max_price);
    // setSliderValue('monthly-fee-range-slider-agenteditview', agent.criteria.min_monthly_price, agent.criteria.max_monthly_price);
    setSliderValue('square-meters-range-slider-agenteditview', agent.criteria.min_square_meters, agent.criteria.max_square_meters);
    setSliderValue('rooms-range-slider-agenteditview', agent.criteria.min_rooms, agent.criteria.max_rooms);
    // Safely setting values for postal numbers and cities
    $("#postal-number-agenteditview").val((agent.postal_numbers && agent.criteria.postal_numbers.length > 0) ? agent.criteria.postal_numbers[0] : '');
    $("#city-agenteditview").val((agent.cities && agent.criteria.cities.length > 0) ? agent.criteria.cities[0] : '');


    showView("agent_edit")
}

function setSliderValue(sliderId, from, to) {
    console.log(sliderId)
    console.log(from)
    document.getElementById(sliderId).noUiSlider.set([from, to]);
}


function createAgentRow(agent) {
    return `
        <tr>
            <td>${agent.description || 'N/A'}</td>
            <td class="text-end">${agent.matches || 'N/A'}</td>
            <td class="text-end">
                <span class="badge ${agent.active ? 'bg-success' : 'bg-secondary'}">${agent.active ? 'Aktiv' : 'Inaktiv'}</span>
            </td>
            <td class="text-end">
            <button class="btn" onclick="editAgent('${agent._id}')">
                <i class="bi bi-pen" ></i>
            </button>

            <button class="btn btn-delete-agent" data-agent-id="${agent._id}">
                <i class="bi bi-trash"></i>
            </button>

            </td>
        </tr>
    `;
}


function deleteAgent(agentId) {
    console.log('Deleting agent:', agentId);
    // Implement the deletion logic here, potentially using authFetch to send a DELETE request
    // Example of authFetch usage:
    authFetch(`/agent/${agentId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Annonceagenten blev ikke slettet');
            // Optionally, remove the row from the table to update the UI
            $(`button[data-agent-id="${agentId}"]`).closest('tr').remove();
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage(error.message); // Display error using your existing function
        });
}


window.editAgent = editAgent