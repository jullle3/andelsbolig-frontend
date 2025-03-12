import { authFetch } from "../auth/auth.js";
import {displayErrorMessage, showConfirmationModal} from "../utils.js";
import {showView} from "../views/viewManager.js";
import {activeAgent} from "../agent_edit/agent_edit.js";

export async function SetupAgentView() {
    setupDeleteConfirmation();
}

export async function loadAgents() {
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

    const $tableBody = $('#agent-table-body');
    $tableBody.empty(); // Clear previous entries
    if (agents.length > 0) {
        agents.forEach(function (agent) {
            $tableBody.append(createAgentRow(agent));
        });
    } else {
        $tableBody.append('<tr><td colspan="4" class="text-center">Du har ingen annonceagenter</td></tr>');
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
    activeAgent._id = agent._id
    activeAgent.created = agent.created
    activeAgent.updated = agent.updated
    activeAgent.created_by = agent.created_by
    activeAgent.notifications = agent.notifications
    activeAgent.active = agent.active
    activeAgent.criteria = agent.criteria

    // Edit sliders to update UI
    document.getElementById('advertisement-list-search-agenteditview').value = agent.criteria.text || '';
    setSliderValue('price-range-slider-agenteditview', agent.criteria.price_from, agent.criteria.price_to);
    setSliderValue('monthly-price-range-slider-agenteditview', agent.criteria.monthly_price_from, agent.criteria.monthly_price_to);
    setSliderValue('square-meters-range-slider-agenteditview', agent.criteria.square_meters_from, agent.criteria.square_meters_to);
    setSliderValue('rooms-range-slider-agenteditview', agent.criteria.rooms_from, agent.criteria.rooms_to);
    $("#radius-agenteditview").val((agent.criteria.radius));
    $("#radius-postalnumber-agenteditview").val((agent.criteria.postal_numbers && agent.criteria.postal_numbers.length > 0) ? agent.criteria.postal_numbers[0] : '');
    $("#postal-number-agenteditview").val((agent.criteria.postal_numbers && agent.criteria.postal_numbers.length > 0) ? agent.criteria.postal_numbers[0] : '');
    $("#city-agenteditview").val((agent.criteria.cities && agent.criteria.cities.length > 0) ? agent.criteria.cities[0] : '');
    $("#name-agenteditview").val(agent.name);
    $("#active-agenteditview").prop('checked', agent.active);

    showView("agent_edit")
}

function setSliderValue(sliderId, from, to) {
    document.getElementById(sliderId).noUiSlider.set([from, to]);
}


function createAgentRow(agent) {
    return `
        <tr>
            <td>${agent.name || ''}</td>
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
