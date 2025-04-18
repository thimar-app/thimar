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
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        # 1) Retrieve Mistral API key
        mistral_api_key = settings.MISTRAL_API_KEY
        if not mistral_api_key:
            return Response(
                {"error": "MISTRAL_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2) Parse user data
        existing_goals = request.data.get("existing_goals", [])
        previous_generations = request.data.get("previous_generations", [])  # List of previous goal suggestions
        timestamp = request.data.get("timestamp", datetime.now().isoformat())  # Added timestamp for uniqueness
        attempt = request.data.get("attempt", 0)  # Added attempt counter for uniqueness

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
                "You are an Islamic productivity assistant creating faith-centered goals for Muslims. "
                "Your goal is to help users achieve excellence (ihsan) and balance (wasatiyyah) in their lives. "
                "Consider both worldly productivity and spiritual growth when suggesting goals. "
                "Incorporate Islamic principles such as: "
                "- Seeking knowledge (ilm) "
                "- Maintaining good health (sihha) "
                "- Strengthening family bonds (silat ar-rahim) "
                "- Contributing to community (khidma) "
                "- Spiritual development (tazkiyah) "
                "- Financial responsibility (amana) "
                "- Environmental stewardship (khalifa) "
                "- Personal development (tazkiyah) "
                "- Social justice (adl) "
                "- Gratitude (shukr) "
                "Provide a concise, actionable goal with a brief explanation of its Islamic significance and practical benefits. "
                "IMPORTANT: Each response must be unique and different from previous generations. "
                "Avoid suggesting similar goals or using the same explanations."
            )
        }

        user_message = {
            "role": "user",
            "content": self._build_prompt(existing_goals, previous_generations, timestamp, attempt)
        }

        messages = [system_message, user_message]

        # 5) Call Mistral chat
        try:
            # Increase temperature for more variety, especially on regeneration attempts
            temperature = min(0.9 + (attempt * 0.1), 1.0)  # Increase temperature with each attempt, max 1.0
            
            response = client.chat.complete(
                model="mistral-large-latest",
                messages=messages,
                max_tokens=300,
                temperature=temperature  # Dynamic temperature based on attempt
            )

            ai_text = response.choices[0].message.content.strip()
            lines = ai_text.split("\n")

            new_goal = None
            description = None
            for line in lines:
                if line.startswith("NEW GOAL:"):
                    new_goal = line.replace("NEW GOAL:", "").strip()
                elif line.startswith("DESCRIPTION:"):
                    description = line.replace("DESCRIPTION:", "").strip()

            goal_data = {"goal": new_goal, "description": description}

            # Verify uniqueness
            if self._is_duplicate(goal_data, previous_generations):
                # If duplicate found, retry with higher temperature
                return self.post(request, *args, **kwargs)

            return Response(goal_data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _build_prompt(self, existing_goals, previous_generations, timestamp="", attempt=0):
        """
        Construct a user message describing the user's existing goals,
        plus instructions on what we want back.
        """
        # Convert existing goals array into a bullet list
        goals_str = "\n".join(
            f"- {g.get('name','Unnamed Goal')} (progress: {g.get('progress',0)}%): {g.get('description','')}"
            for g in existing_goals
        )

        # Format previous generations
        previous_generations_str = ""
        if previous_generations:
            previous_generations_str = "\nPreviously Suggested Goals:\n" + "\n".join(
                f"- Goal: {gen.get('goal', '')}\n  Description: {gen.get('description', '')}"
                for gen in previous_generations[-3:]  # Only show last 3 generations
            )

        # Add timestamp and attempt to force uniqueness
        uniqueness_str = f"\nTimestamp: {timestamp}\nAttempt: {attempt}\n"

        prompt = f"""
Below is a list of the user's current goals, each with some progress and a brief description:

{goals_str}
{previous_generations_str}
{uniqueness_str}

Now, please suggest:
1) A new goal (title) that aligns or complements these existing goals.
2) A VERY SHORT description of only 4-6 words explaining the goal's purpose.

The goal should:
- Be specific and measurable
- Balance worldly productivity with spiritual growth
- Connect to Islamic principles where appropriate
- Be achievable within a reasonable timeframe
- Complement the user's existing goals
- Be COMPLETELY DIFFERENT from previously suggested goals
- Use different Islamic principles or focus areas than previous suggestions
- Provide a fresh perspective on productivity and spiritual growth
- Vary in scope and complexity from previous suggestions

IMPORTANT: The description MUST be extremely concise - only 4-6 words total.

Respond in this format (no extra explanation):
NEW GOAL: <goal title>
DESCRIPTION: <4-6 word description>
"""
        return prompt.strip()

    def _is_duplicate(self, new_generation, previous_generations):
        """
        Check if the new generation is too similar to previous ones.
        """
        if not previous_generations:
            return False

        # Check for exact matches
        for prev_gen in previous_generations:
            if (new_generation["goal"] == prev_gen.get("goal", "") or
                new_generation["description"] == prev_gen.get("description", "")):
                return True

        # Check for high similarity in goals and descriptions
        new_goal_words = set(new_generation["goal"].lower().split())
        new_desc_words = set(new_generation["description"].lower().split())
        
        for prev_gen in previous_generations:
            prev_goal_words = set(prev_gen.get("goal", "").lower().split())
            prev_desc_words = set(prev_gen.get("description", "").lower().split())
            
            # Calculate word overlap percentage
            if new_goal_words and prev_goal_words:
                goal_overlap = len(new_goal_words.intersection(prev_goal_words)) / len(new_goal_words)
                if goal_overlap > 0.6:  # Reduced from 0.7 to 0.6 to catch more duplicates
                    return True
                    
            if new_desc_words and prev_desc_words:
                desc_overlap = len(new_desc_words.intersection(prev_desc_words)) / len(new_desc_words)
                if desc_overlap > 0.6:  # Reduced from 0.7 to 0.6 to catch more duplicates
                    return True

        return False

class GenerateTaskView(APIView):
    """
    Endpoint that suggests a new task based on completed tasks and current goal,
    using Mistral AI's chat-based completion.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1) Retrieve Mistral API key
        mistral_api_key = settings.MISTRAL_API_KEY
        if not mistral_api_key:
            return Response(
                {"error": "MISTRAL_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2) Parse user data
        goal_id = request.data.get("goal_id")
        completed_tasks = request.data.get("completed_tasks", [])
        current_goal = request.data.get("current_goal", {})
        previous_generations = request.data.get("previous_generations", [])  # List of previous task suggestions
        user_timezone = request.data.get("timezone", "UTC")  # User's timezone for prayer times

        if not goal_id or not current_goal:
            return Response(
                {"error": "Missing required fields: goal_id and current_goal"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Initialize the Mistral client
        client = Mistral(api_key=mistral_api_key)

        # 4) Build chat messages
        system_message = {
            "role": "system",
            "content": (
                "You are an Islamic productivity assistant creating actionable tasks for Muslims. "
                "Your goal is to help users break down their goals into manageable, meaningful steps. "
                "Consider both practical efficiency and spiritual significance when suggesting tasks. "
                "Incorporate Islamic principles such as: "
                "- Intention (niyyah) and mindfulness "
                "- Consistency (istiqamah) "
                "- Excellence (ihsan) in work "
                "- Time management (adab) "
                "- Balance (wasatiyyah) "
                "Provide specific, actionable tasks that align with the user's goals and Islamic values. "
                "IMPORTANT: Each response must be unique and different from previous generations. "
                "Avoid suggesting similar tasks or using the same descriptions. "
                "ALWAYS suggest an appropriate prayer time for the task based on its nature and duration."
            )
        }

        user_message = {
            "role": "user",
            "content": self._build_prompt(goal_id, completed_tasks, current_goal, previous_generations, user_timezone)
        }

        messages = [system_message, user_message]

        # 5) Call Mistral chat
        try:
            response = client.chat.complete(
                model="mistral-large-latest",
                messages=messages,
                max_tokens=400,
                temperature=0.9  # Increased for more variety
            )

            ai_text = response.choices[0].message.content.strip()
            lines = ai_text.split("\n")
            
            task_data = {
                "title": "",
                "description": "",
                "priority": "Medium",
                "repeat": False,
                "prayer_time": "",  # New field for prayer time suggestion
                "prayer_context": ""  # New field for prayer context/explanation
            }

            for line in lines:
                if line.startswith("TITLE:"):
                    task_data["title"] = line.replace("TITLE:", "").strip()
                elif line.startswith("DESCRIPTION:"):
                    task_data["description"] = line.replace("DESCRIPTION:", "").strip()
                elif line.startswith("PRIORITY:"):
                    priority = line.replace("PRIORITY:", "").strip().lower()
                    if priority in ["low", "medium", "high", "urgent"]:
                        task_data["priority"] = priority.capitalize()
                elif line.startswith("REPEAT:"):
                    repeat = line.replace("REPEAT:", "").strip().lower()
                    task_data["repeat"] = repeat == "yes"
                elif line.startswith("PRAYER_TIME:"):
                    task_data["prayer_time"] = line.replace("PRAYER_TIME:", "").strip()
                elif line.startswith("PRAYER_CONTEXT:"):
                    task_data["prayer_context"] = line.replace("PRAYER_CONTEXT:", "").strip()

            # Verify uniqueness
            if self._is_duplicate(task_data, previous_generations):
                # If duplicate found, retry with higher temperature
                return self.post(request, *args, **kwargs)

            return Response(task_data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _build_prompt(self, goal_id, completed_tasks, current_goal, previous_generations, user_timezone):
        """
        Construct a user message describing the context and requirements for task generation.
        """
        # Format completed tasks
        completed_tasks_str = "\n".join(
            f"- {task.get('title', 'Unnamed Task')}: {task.get('description', '')}"
            for task in completed_tasks
        ) if completed_tasks else "No completed tasks yet."

        # Format previous generations
        previous_generations_str = ""
        if previous_generations:
            previous_generations_str = "\nPreviously Suggested Tasks:\n" + "\n".join(
                f"- Title: {gen.get('title', '')}\n  Description: {gen.get('description', '')}"
                for gen in previous_generations[-3:]  # Only show last 3 generations
            )

        prompt = f"""
Current Goal:
Title: {current_goal.get('title', 'Unnamed Goal')}
Description: {current_goal.get('description', 'No description provided')}
Progress: {current_goal.get('progress', 0)}%

Recently Completed Tasks:
{completed_tasks_str}
{previous_generations_str}

User's Timezone: {user_timezone}

Please suggest a new task that:
1) Aligns with the current goal
2) Builds upon recently completed tasks
3) Maintains a good balance of challenge and achievability
4) Incorporates Islamic principles where relevant
5) Is specific and actionable
6) Includes an appropriate prayer time suggestion

The task should be:
- Clear and well-defined
- Realistic to complete
- Meaningful in progress towards the goal
- Aligned with Islamic values and principles
- Properly prioritized based on importance and urgency
- COMPLETELY DIFFERENT from previously suggested tasks
- Using different approaches or focus areas than previous suggestions
- Providing a fresh perspective on task completion
- Appropriately timed around prayer times

IMPORTANT: The task description MUST be extremely concise - only 4-6 words total.

Consider these prayer times and their significance:
- Fajr: Early morning, good for starting the day with intention
- Dhuhr: Midday, good for taking a break and reflection
- Asr: Afternoon, good for reviewing progress
- Maghrib: Evening, good for wrapping up and gratitude
- Isha: Night, good for planning and reflection

Respond in this format (no extra explanation):
TITLE: <task title>
DESCRIPTION: <4-6 word description>
PRIORITY: Low/Medium/High/Urgent
REPEAT: Yes/No
PRAYER_TIME: <suggested prayer time (Fajr/Dhuhr/Asr/Maghrib/Isha)>
PRAYER_CONTEXT: <brief explanation of why this prayer time is appropriate for the task>
"""
        return prompt.strip()

    def _is_duplicate(self, new_generation, previous_generations):
        """
        Check if the new generation is too similar to previous ones.
        """
        if not previous_generations:
            return False

        # Check for exact matches
        for prev_gen in previous_generations:
            if (new_generation["title"] == prev_gen.get("title", "") or
                new_generation["description"] == prev_gen.get("description", "")):
                return True

        # Check for high similarity in titles and descriptions
        new_title_words = set(new_generation["title"].lower().split())
        new_desc_words = set(new_generation["description"].lower().split())
        
        for prev_gen in previous_generations:
            prev_title_words = set(prev_gen.get("title", "").lower().split())
            prev_desc_words = set(prev_gen.get("description", "").lower().split())
            
            title_overlap = len(new_title_words.intersection(prev_title_words)) / len(new_title_words)
            desc_overlap = len(new_desc_words.intersection(prev_desc_words)) / len(new_desc_words)
            
            if title_overlap > 0.7 or desc_overlap > 0.7:  # If more than 70% words are the same
                return True

        return False

class GenerateBaraqahView(APIView):
    """
    Endpoint that generates a personalized baraqah (blessing) message based on the user's
    completed tasks and current goal, using Mistral AI's chat-based completion.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1) Retrieve Mistral API key
        mistral_api_key = settings.MISTRAL_API_KEY
        if not mistral_api_key:
            return Response(
                {"error": "MISTRAL_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2) Parse user data
        goal_id = request.data.get("goal_id")
        completed_tasks = request.data.get("completed_tasks", [])
        current_goal = request.data.get("current_goal", {})
        previous_generations = request.data.get("previous_generations", [])  # List of previous baraqah messages
        timestamp = request.data.get("timestamp", "")  # Added timestamp for uniqueness
        attempt = request.data.get("attempt", 0)  # Added attempt counter for uniqueness

        print(f"Generating baraqah for goal_id: {goal_id}, attempt: {attempt}")

        if not goal_id or not current_goal:
            return Response(
                {"error": "Missing required fields: goal_id and current_goal"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Initialize the Mistral client
        client = Mistral(api_key=mistral_api_key)

        # 4) Build chat messages
        system_message = {
            "role": "system",
            "content": (
                "You are an Islamic spiritual guide creating personalized baraqah (blessing) messages. "
                "Your goal is to inspire and encourage Muslims in their productivity journey while "
                "connecting their efforts to spiritual growth. Consider these Islamic principles: "
                "- Tawakkul (trust in Allah) "
                "- Shukr (gratitude) "
                "- Ihsan (excellence) "
                "- Sabr (patience) "
                "- Istiqamah (consistency) "
                "Provide meaningful, personalized messages that acknowledge their progress and "
                "encourage continued growth in both worldly and spiritual pursuits. "
                "IMPORTANT: Each response must be unique and different from previous generations. "
                "Avoid repeating similar messages, verses, or explanations."
            )
        }

        user_message = {
            "role": "user",
            "content": self._build_prompt(goal_id, completed_tasks, current_goal, previous_generations, timestamp, attempt)
        }

        messages = [system_message, user_message]

        # 5) Call Mistral chat
        try:
            # Increase temperature for more variety, especially on regeneration attempts
            temperature = min(0.9 + (attempt * 0.1), 1.0)  # Increase temperature with each attempt, max 1.0
            
            print(f"Calling Mistral with temperature: {temperature}")
            
            response = client.chat.complete(
                model="mistral-large-latest",
                messages=messages,
                max_tokens=500,
                temperature=temperature  # Dynamic temperature based on attempt
            )

            baraqah_text = response.choices[0].message.content.strip()
            print(f"Raw AI response: {baraqah_text}")
            
            # Parse the response into structured format
            baraqah_data = {
                "message": "",
                "source": "",
                "explanation": ""
            }

            lines = baraqah_text.split("\n")
            for line in lines:
                if line.startswith("MESSAGE:"):
                    baraqah_data["message"] = line.replace("MESSAGE:", "").strip()
                elif line.startswith("SOURCE:"):
                    baraqah_data["source"] = line.replace("SOURCE:", "").strip()
                elif line.startswith("EXPLANATION:"):
                    baraqah_data["explanation"] = line.replace("EXPLANATION:", "").strip()

            # Ensure we have at least a message
            if not baraqah_data["message"]:
                # If no message was found, use the entire response as the message
                baraqah_data["message"] = baraqah_text
                baraqah_data["source"] = "Islamic wisdom"
                baraqah_data["explanation"] = "A reminder of Allah's blessings in our daily endeavors."

            # Verify uniqueness
            if self._is_duplicate(baraqah_data, previous_generations):
                print(f"Duplicate detected, retrying with higher temperature")
                # If duplicate found, retry with higher temperature
                return self.post(request, *args, **kwargs)

            print(f"Generated unique baraqah: {baraqah_data['message'][:50]}...")
            return Response(baraqah_data, status=200)

        except Exception as e:
            print(f"Error generating baraqah: {str(e)}")
            # Return a fallback response instead of an error
            fallback_data = {
                "message": "May Allah bless your efforts and guide you to success.",
                "source": "General Islamic wisdom",
                "explanation": "A reminder of Allah's blessings in our daily endeavors."
            }
            return Response(fallback_data, status=200)  # Return 200 to avoid frontend errors

    def _build_prompt(self, goal_id, completed_tasks, current_goal, previous_generations, timestamp="", attempt=0):
        """
        Construct a user message describing the context for baraqah generation.
        """
        # Format completed tasks
        completed_tasks_str = "\n".join(
            f"- {task.get('title', 'Unnamed Task')}: {task.get('description', '')}"
            for task in completed_tasks
        ) if completed_tasks else "No completed tasks yet."

        # Format previous generations
        previous_generations_str = ""
        if previous_generations:
            previous_generations_str = "\nPrevious Baraqah Messages:\n" + "\n".join(
                f"- Message: {gen.get('message', '')}\n  Source: {gen.get('source', '')}"
                for gen in previous_generations[-3:]  # Only show last 3 generations
            )

        # Add timestamp and attempt to force uniqueness
        uniqueness_str = f"\nTimestamp: {timestamp}\nAttempt: {attempt}\n"

        prompt = f"""
Current Goal:
Title: {current_goal.get('title', 'Unnamed Goal')}
Description: {current_goal.get('description', 'No description provided')}
Progress: {current_goal.get('progress', 0)}%
{uniqueness_str}
Recently Completed Tasks:
{completed_tasks_str}
{previous_generations_str}

Please generate a personalized baraqah (blessing) message that:
1) Acknowledges their progress and efforts
2) Connects their productivity to spiritual growth
3) Provides encouragement for continued improvement
4) References relevant Islamic teachings or principles
5) Includes a brief explanation of the message's significance

The message should be:
- Personal and meaningful
- Rooted in Islamic wisdom
- Encouraging and motivating
- Balanced between worldly and spiritual aspects
- Clear and concise
- COMPLETELY DIFFERENT from previous generations
- Using different Quranic verses or hadith than previously used
- Providing a fresh perspective on their progress

IMPORTANT: The baraqah message MUST be extremely concise - only ONE SHORT SENTENCE (maximum 15 words).

Respond in this format (no extra explanation):
MESSAGE: <one short sentence baraqah message>
SOURCE: <relevant Quranic verse, hadith, or Islamic teaching>
EXPLANATION: <brief explanation of the message's significance>
"""
        return prompt.strip()

    def _is_duplicate(self, new_generation, previous_generations):
        """
        Check if the new generation is too similar to previous ones.
        """
        if not previous_generations:
            return False

        # Check for exact matches
        for prev_gen in previous_generations:
            if (new_generation["message"] == prev_gen.get("message", "") or
                new_generation["source"] == prev_gen.get("source", "")):
                return True

        # Check for high similarity in messages (simple word overlap)
        new_words = set(new_generation["message"].lower().split())
        for prev_gen in previous_generations:
            prev_words = set(prev_gen.get("message", "").lower().split())
            if not new_words or not prev_words:  # Skip if empty
                continue
                
            overlap = len(new_words.intersection(prev_words)) / len(new_words)
            if overlap > 0.7:  # If more than 70% words are the same
                return True

        return False