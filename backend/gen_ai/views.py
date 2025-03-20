import os
from mistralai import Mistral
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import datetime

from thimar_project import settings

class GenerateGoalView(APIView):
    """
    Endpoint that suggests a new goal and a brief description,
    using Mistral AI's chat-based completion.
    """
    permission_classes = [permissions.IsAuthenticated]  # or AllowAny if you want no auth

    def post(self, request, *args, **kwargs):
        # 1) Retrieve Mistral API key
        mistral_api_key = settings.MISTRAL_API_KEY
        if not mistral_api_key:
            return Response(
                {"error": "MISTRAL_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2) Parse user data: existing goals array, progress, etc.
        # Example request body:
        # {
        #   "existing_goals": [
        #       {"name": "Read 10 books", "progress": 40, "description": "Reading personal dev books"},
        #       {"name": "Learn Python", "progress": 70, "description": "Studying daily with tutorials"}
        #   ]
        # }
        existing_goals = request.data.get("existing_goals", [])
        if not existing_goals:
            return Response(
                {"error": "No 'existing_goals' provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Initialize the Mistral client
        client = Mistral(api_key=mistral_api_key)

        # 4) Build chat messages
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful AI creating a concise, faith-centered goal for the user. "
                "Provide a single-sentence explanation inspired by Islamic principles such as ihsan (excellence) and wasatiyyah (balance). "
                "Align this new goal with the user’s existing goals, fostering both worldly productivity and spiritual growth. "
                "Clearly present the goal and the single-sentence explanation."
            )
        }

        user_message = {
            "role": "user",
            "content": self._build_prompt(existing_goals)
        }

        messages = [system_message, user_message]

        # 5) Call Mistral chat
        try:
            response = client.chat.complete(
                model="mistral-large-latest",
                messages=messages,
                max_tokens=200,
                temperature=0.7
            )

            ai_text = response.choices[0].message.content.strip()
            lines = ai_text.split("\n")
            # e.g. lines[0] might have "NEW GOAL: Practice Speed Reading"
            # lines[1] might have "DESCRIPTION: By dedicating..."

            new_goal = None
            description = None
            for line in lines:
                if line.startswith("NEW GOAL:"):
                    new_goal = line.replace("NEW GOAL:", "").strip()
                elif line.startswith("DESCRIPTION:"):
                    description = line.replace("DESCRIPTION:", "").strip()

            return Response({"goal": new_goal, "description": description}, status=200)


        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _build_prompt(self, existing_goals):
        """
        Construct a user message describing the user's existing goals,
        plus instructions on what we want back.
        """
        # Convert existing goals array into a bullet list
        goals_str = "\n".join(
            f"- {g.get('name','Unnamed Goal')} (progress: {g.get('progress',0)}%): {g.get('description','')}"
            for g in existing_goals
        )

        prompt = f"""
Below is a list of the user's current goals, each with some progress and a brief description:

{goals_str}

Now, please suggest:
1) A new goal (title) that aligns or complements these existing goals.
2) A brief description (1-3 sentences) explaining why this new goal is relevant or beneficial.

Respond in this format (no extra explanation):
NEW GOAL: <goal title>
DESCRIPTION: <brief description>
"""
        return prompt.strip()



class GenerateTaskView(APIView):
    """
    Generates a new task (name, 5-word max description, priority, repeat yes/no)
    using Mistral's chat completion, considering:
      - Completed tasks
      - The current goal name/description
    """
    permission_classes = [permissions.IsAuthenticated]  # Or AllowAny if desired

    def post(self, request, *args, **kwargs):
        # 1) Retrieve Mistral API key
        mistral_api_key = os.getenv("MISTRAL_API_KEY")
        if not mistral_api_key:
            return Response(
                {"error": "MISTRAL_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2) Parse user input from request body
        # Example JSON:
        # {
        #   "completed_tasks": ["Read 2 chapters", "Wrote summary", "Prayed Fajr on time"],
        #   "goal_name": "Improve Reading Speed",
        #   "goal_description": "Focus on finishing books efficiently"
        # }
        completed_tasks = request.data.get("completed_tasks", [])
        goal_name = request.data.get("goal_name", "")
        goal_description = request.data.get("goal_description", "")

        # Validate
        if not goal_name or not goal_description:
            return Response(
                {"error": "Missing 'goal_name' or 'goal_description'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Initialize Mistral client
        client = Mistral(api_key=mistral_api_key)

        # 4) Build the chat messages
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful AI creating a new task. "
                "Respond with exactly 4 lines:\n"
                "TASK NAME: <Short title>\n"
                "DESCRIPTION: <Up to 5 words>\n"
                "PRIORITY: Low/Medium/High/Urgent\n"
                "REPEAT: Yes/No\n\n"
                "Focus on the user’s productivity. Consider their completed tasks, current goal, "
                "and, if relevant, include a brief Islamic perspective."
            )
        }

        user_message = {
            "role": "user",
            "content": self._build_prompt(completed_tasks, goal_name, goal_description)
        }

        messages = [system_message, user_message]

        # 5) Call the Mistral chat completion
        try:
            response = client.chat.complete(
                model="mistral-large-latest",  # or whichever model is available
                messages=messages,
                max_tokens=120,
                temperature=0.7,
            )
            ai_text = response.choices[0].message.content.strip()

            # 6) Parse AI text
            lines = ai_text.split("\n")
            new_task = {}
            for line in lines:
                line = line.strip()
                if line.startswith("TASK NAME:"):
                    new_task["name"] = line.replace("TASK NAME:", "").strip()
                elif line.startswith("DESCRIPTION:"):
                    new_task["description"] = line.replace("DESCRIPTION:", "").strip()
                elif line.startswith("PRIORITY:"):
                    new_task["priority"] = line.replace("PRIORITY:", "").strip()
                elif line.startswith("REPEAT:"):
                    new_task["repeat"] = line.replace("REPEAT:", "").strip()

            # If the AI didn't follow format, new_task might be empty or partial
            if not new_task:
                # Optionally handle this scenario
                return Response(
                    {"error": "AI output did not match the expected format.", "raw": ai_text},
                    status=status.HTTP_200_OK
                )

            return Response(new_task, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _build_prompt(self, completed_tasks, goal_name, goal_description):
        """
        Create a user message summarizing the completed tasks and current goal info.
        """
        tasks_list_str = "\n".join(f"- {task}" for task in completed_tasks)
        return f"""User has the following completed tasks:
{tasks_list_str}

Current Goal:
Name: {goal_name}
Description: {goal_description}

Generate one new, concise task aligned with the current goal. 
Remember the format must be 4 lines:
1) TASK NAME (short)
2) DESCRIPTION (5 words max)
3) PRIORITY (Low/Medium/High/Urgent)
4) REPEAT (Yes/No)
"""


class GenerateBaraqah(APIView):
    """
    Returns a text message containing a douaa or nasi7a (advice) based on the current day or month.
    """
    # Set permissions as needed, e.g., AllowAny for public access
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        now = datetime.now()
        day_of_week = now.strftime("%A")  # e.g., 'Monday', 'Tuesday', etc.
        month = now.month

        # Customize your advice/douaa based on the day of week or month.
        # Note: For a real-world application, you might use an Islamic calendar to detect Ramadan.
        if day_of_week == "Friday":
            message = "Friday Douaa: O Allah, forgive our sins and bless our efforts."
        elif month == 4:  # Placeholder: Assume April corresponds to Ramadan for demonstration.
            message = "Ramadan Advice: May your Taraweeh prayers uplift your spirit."
        else:
            message = "Daily Advice: Seek excellence and balance in every deed."

        return Response({"text": message}, status=status.HTTP_200_OK)