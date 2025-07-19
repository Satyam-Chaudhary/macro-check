import typer
import requests
import json
from datetime import datetime
from rich.console import Console
from rich.table import Table

app = typer.Typer()
console = Console()

# --- Configuration ---
BASE_URL = "http://127.0.0.1:8000/api/v1"
TEST_USER = {
    # "email": "test@example.com",
    # "password": "a_strong_password",
    "email": "user@example.com",
    "password": "test"
}

# Make sure a user with these credentials exists via the /signup endpoint

def get_auth_token():
    """Logs in the test user and returns the auth token."""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": TEST_USER["email"], "password": TEST_USER["password"]}
        )
        response.raise_for_status() # Raises an exception for bad status codes
        return response.json()["access_token"]
    except requests.exceptions.RequestException as e:
        console.print(f"[bold red]API Error: Could not log in. Is the server running? Details: {e}[/bold red]")
        return None

@app.command()
def set_goal(
    calories: float = typer.Option(..., "--calories"),
    protein: float = typer.Option(..., "--protein"),
    carbs: float = typer.Option(..., "--carbs"),
    fat: float = typer.Option(..., "--fat"),
):
    """Set the nutritional goal for today via the API."""
    token = get_auth_token()
    if not token: return

    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "date": str(datetime.utcnow().date()),
        "calories": calories, "protein": protein, "carbs": carbs, "fat": fat
    }
    response = requests.post(f"{BASE_URL}/goals/", headers=headers, json=payload)

    if response.status_code == 200:
        console.print("[bold green]✅ Goal set successfully via API![/bold green]")
    else:
        console.print(f"[bold red]Error setting goal: {response.text}[/bold red]")

@app.command()
def add_log(
    description: str = typer.Option(..., "--desc"),
    meal_type: str = typer.Option(..., "--meal"),
    calories: float = typer.Option(..., "--kcal"),
    protein: float = typer.Option(..., "--p"),
    carbs: float = typer.Option(..., "--c"),
    fat: float = typer.Option(..., "--f"),
):
    """Add a new food log entry for today via the API."""
    token = get_auth_token()
    if not token: return

    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "date": str(datetime.utcnow().date()), "meal_type": meal_type,
        "description": description, "calories": calories, "protein": protein,
        "carbs": carbs, "fat": fat
    }
    response = requests.post(f"{BASE_URL}/logs/", headers=headers, json=payload)
    
    if response.status_code == 200:
        console.print(f"[bold green]✅ Log '{description}' added successfully via API![/bold green]")
    else:
        console.print(f"[bold red]Error adding log: {response.text}[/bold red]")

@app.command()
def show_day(
    day_str: str = typer.Argument(datetime.utcnow().strftime("%Y-%m-%d")),
):
    """Fetch and display the daily summary from the API."""
    token = get_auth_token()
    if not token: return
    
    headers = {"Authorization": f"Bearer {token}"}
    params = {"target_date": day_str}
    response = requests.get(f"{BASE_URL}/analytics/daily-summary", headers=headers, params=params)

    if response.status_code != 200:
        console.print(f"[bold red]Error fetching summary: {response.text}[/bold red]")
        return
        
    data = response.json()
    console.print(f"[bold cyan]--- Summary for {data['date']} ---[/bold cyan]")

    # --- Summary Table ---
    summary_table = Table(show_header=True, header_style="bold magenta")
    summary_table.add_column("Metric", style="dim")
    summary_table.add_column("Goal", justify="right")
    summary_table.add_column("Actual", justify="right")
    summary_table.add_column("Remaining", justify="right")

    macros = [
        ("Calories (kcal)", data['goal_calories'], data['actual_calories'], data['remaining_calories']),
        ("Protein (g)", data['goal_protein'], data['actual_protein'], data['remaining_protein']),
        ("Carbs (g)", data['goal_carbs'], data['actual_carbs'], data['remaining_carbs']),
        ("Fat (g)", data['goal_fat'], data['actual_fat'], data['remaining_fat']),
    ]
    for name, goal, actual, remaining in macros:
        color = "green" if remaining >= 0 else "red"
        summary_table.add_row(name, f"{goal:.0f}", f"{actual:.0f}", f"[{color}]{remaining:.0f}[/{color}]")

    console.print(summary_table)

    # --- Logs Table ---
    if data['logs']:
        logs_table = Table(title="Food Logs", show_header=True, header_style="bold blue")
        logs_table.add_column("Meal Type")
        logs_table.add_column("Description")
        logs_table.add_column("Calories", justify="right")
        logs_table.add_column("Protein", justify="right")
        
        for log in data['logs']:
            logs_table.add_row(
                log['meal_type'], log['description'], f"{log['calories']:.0f}", f"{log['protein']:.0f}"
            )
        console.print(logs_table)
    else:
        console.print("[yellow]No logs found for this day.[/yellow]")

if __name__ == "__main__":
    app()