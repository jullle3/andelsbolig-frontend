import { authFetch } from "../auth/auth.js";
import { displayErrorMessage } from "../utils.js";

export async function SetupAgentView() {
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


function showConfirmationModal(title, message, onConfirm) {
    // Set the title and message
    $('#genericConfirmationModalLabel').text(title);
    $('#genericConfirmationModal .modal-body').text(message);

    // Remove any existing event handlers to avoid duplication
    $('#confirmActionButton').off('click').on('click', function() {
        onConfirm(); // Execute the callback function when confirmed
        $('#genericConfirmationModal').modal('hide');
    });

    // Show the modal
    $('#genericConfirmationModal').modal('show');
}

$(document).ready(function() {
    // Example usage for deleting an agent
    $('.delete-agent-button').on('click', function() {
        const agentId = $(this).data('agentId');
        showConfirmationModal(
            'Confirm Delete',
            'Are you sure you want to delete this agent?',
            function() {
                deleteAgent(agentId);
            }
        );
    });
});

function deleteAgent(agentId) {
    console.log('Deleting agent:', agentId);
    // Implement the deletion logic here
}
