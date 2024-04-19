// This function is called whenever the leaderboard.html page is loaded. It fetches leaderboard data and updates the table.
async function fetchLeaderboardData() {
    const response = await fetch('/leaderboard-data');
    const data = await response.json();

    // Update the table with the fetched data
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // The win/loss/games played fields are zeroed out for now.
    data.forEach((user) => {
        const row = `<tr>
                        <td>${user.user_name}</td>
                        <td>${user._id}</td>
                        <td>${user.balance}</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>`;
        tbody.innerHTML += row;
    });
}