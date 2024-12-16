import { authFetch } from "../auth/auth.js";
import {displayErrorMessage, showConfirmationModal} from "../utils.js";

export async function SetupAgentView() {
    setupDeleteConfirmation();

    const response = await authFetch(`/agent`);
    if (!response.ok) {
        console.log("error");
        displayErrorMessage("Failed to load agents."); // Display error using your existing function
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

    // Similar delegation can be used for editing if needed
    $('#agent-table-body').on('click', '.btn-edit-agent', function() {
        const agentId = $(this).data('agent-id');
        editAgent(agentId); // Assume editAgent is similarly defined
    });

}



function createAgentRow(agent) {
    return `
        <tr>
            <td>${agent.description || 'N/A'}</td>
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

// Optionally define editAgent and deleteAgent functions if they don't already exist
function editAgent(agentId) {
    console.log('Edit agent:', agentId);
    // Add code to handle agent editing
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
