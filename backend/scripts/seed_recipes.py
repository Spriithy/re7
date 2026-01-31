#!/usr/bin/env python3
"""Seed the database with sample French recipes."""

import sys
from pathlib import Path
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.core.database import async_session_maker
from app.models.recipe import Recipe, Ingredient, Step, Difficulty
from datetime import datetime
import uuid


async def seed_recipes():
    """Add sample French recipes to the database."""
    async with async_session_maker() as db:
        try:
            # Get admin user ID
            result = await db.execute(
                text("SELECT id FROM users WHERE is_admin = 1 LIMIT 1")
            )
            author_id = result.fetchone()[0]

            # Get category IDs
            categories = {}
            result = await db.execute(text("SELECT id, slug FROM categories"))
            for row in result:
                categories[row[1]] = row[0]

            recipes_data = [
            {
                "title": "Bœuf Bourguignon",
                "description": "Un grand classique de la cuisine française : du bœuf mijoté dans du vin rouge avec des légumes et des lardons. Un plat réconfortant parfait pour les journées d'hiver.",
                "category": "viandes",
                "difficulty": Difficulty.medium,
                "prep_time": 30,
                "cook_time": 180,
                "servings": 6,
                "serving_unit": "personnes",
                "is_vegetarian": False,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 1.5, "unit": "kg", "name": "bœuf à braiser (paleron ou macreuse)", "order": 0},
                    {"quantity": 200, "unit": "g", "name": "lardons fumés", "order": 1},
                    {"quantity": 3, "unit": None, "name": "carottes", "order": 2},
                    {"quantity": 2, "unit": None, "name": "oignons", "order": 3},
                    {"quantity": 250, "unit": "g", "name": "champignons de Paris", "order": 4},
                    {"quantity": 3, "unit": "gousses", "name": "ail", "order": 5},
                    {"quantity": 75, "unit": "cl", "name": "vin rouge de Bourgogne", "order": 6},
                    {"quantity": 2, "unit": "c. à soupe", "name": "farine", "order": 7},
                    {"quantity": 2, "unit": "c. à soupe", "name": "huile d'olive", "order": 8},
                    {"quantity": 1, "unit": None, "name": "bouquet garni", "order": 9},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 10},
                ],
                "steps": [
                    {"order": 1, "instruction": "Couper la viande en gros cubes de 5 cm environ. Éplucher et couper les carottes en rondelles, les oignons en quartiers.", "timer": None},
                    {"order": 2, "instruction": "Dans une cocotte, faire dorer les lardons. Les retirer et réserver.", "timer": None},
                    {"order": 3, "instruction": "Faire revenir les cubes de bœuf dans la graisse des lardons avec l'huile d'olive jusqu'à ce qu'ils soient bien dorés. Saler et poivrer.", "timer": 10},
                    {"order": 4, "instruction": "Saupoudrer de farine et bien mélanger. Ajouter les carottes, oignons et ail émincé.", "timer": None},
                    {"order": 5, "instruction": "Verser le vin rouge, ajouter le bouquet garni. L'eau doit juste couvrir la viande. Porter à ébullition puis baisser le feu.", "timer": None},
                    {"order": 6, "instruction": "Couvrir et laisser mijoter à feu doux pendant 2h30 à 3h, jusqu'à ce que la viande soit très tendre.", "timer": 180},
                    {"order": 7, "instruction": "30 minutes avant la fin, faire revenir les champignons dans une poêle et les ajouter à la cocotte avec les lardons.", "timer": None},
                    {"order": 8, "instruction": "Servir bien chaud avec des pommes de terre vapeur ou des pâtes fraîches.", "timer": None},
                ],
            },
            {
                "title": "Ratatouille",
                "description": "Un plat provençal coloré et savoureux à base de légumes du soleil mijotés à l'huile d'olive. Parfait chaud ou froid.",
                "category": "plats-accompagnements",
                "difficulty": Difficulty.easy,
                "prep_time": 25,
                "cook_time": 45,
                "servings": 4,
                "serving_unit": "personnes",
                "is_vegetarian": True,
                "is_vegan": True,
                "ingredients": [
                    {"quantity": 2, "unit": None, "name": "aubergines", "order": 0},
                    {"quantity": 2, "unit": None, "name": "courgettes", "order": 1},
                    {"quantity": 2, "unit": None, "name": "poivrons (1 rouge, 1 jaune)", "order": 2},
                    {"quantity": 4, "unit": None, "name": "tomates", "order": 3},
                    {"quantity": 1, "unit": None, "name": "oignon", "order": 4},
                    {"quantity": 3, "unit": "gousses", "name": "ail", "order": 5},
                    {"quantity": 4, "unit": "c. à soupe", "name": "huile d'olive", "order": 6},
                    {"quantity": 1, "unit": "c. à café", "name": "herbes de Provence", "order": 7},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 8},
                ],
                "steps": [
                    {"order": 1, "instruction": "Laver et couper tous les légumes en cubes de taille similaire (environ 2 cm).", "timer": None},
                    {"order": 2, "instruction": "Dans une grande poêle ou sauteuse, faire chauffer l'huile d'olive. Faire revenir l'oignon émincé jusqu'à ce qu'il soit translucide.", "timer": 5},
                    {"order": 3, "instruction": "Ajouter les aubergines et faire cuire 5 minutes en remuant régulièrement.", "timer": 5},
                    {"order": 4, "instruction": "Ajouter les courgettes et les poivrons. Cuire encore 5 minutes.", "timer": 5},
                    {"order": 5, "instruction": "Ajouter les tomates concassées, l'ail haché et les herbes de Provence. Saler et poivrer.", "timer": None},
                    {"order": 6, "instruction": "Couvrir et laisser mijoter à feu doux pendant 30 minutes, en remuant de temps en temps.", "timer": 30},
                    {"order": 7, "instruction": "Servir chaud en accompagnement ou tiède avec du pain grillé et du fromage de chèvre.", "timer": None},
                ],
            },
            {
                "title": "Tarte Tatin",
                "description": "La fameuse tarte aux pommes renversée, caramélisée et parfumée. Un dessert emblématique de la pâtisserie française.",
                "category": "desserts",
                "difficulty": Difficulty.medium,
                "prep_time": 20,
                "cook_time": 40,
                "servings": 8,
                "serving_unit": "parts",
                "is_vegetarian": True,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 1, "unit": None, "name": "pâte feuilletée", "order": 0},
                    {"quantity": 8, "unit": None, "name": "pommes (type Reinette ou Golden)", "order": 1},
                    {"quantity": 100, "unit": "g", "name": "beurre demi-sel", "order": 2},
                    {"quantity": 150, "unit": "g", "name": "sucre en poudre", "order": 3},
                    {"quantity": 1, "unit": "gousse", "name": "vanille (optionnel)", "order": 4},
                ],
                "steps": [
                    {"order": 1, "instruction": "Préchauffer le four à 180°C.", "timer": None},
                    {"order": 2, "instruction": "Éplucher les pommes, les couper en quartiers et retirer le cœur.", "timer": None},
                    {"order": 3, "instruction": "Dans un moule à tarte allant au four (ou une poêle en fonte), faire fondre le beurre avec le sucre à feu moyen jusqu'à obtenir un caramel blond.", "timer": 10},
                    {"order": 4, "instruction": "Disposer les quartiers de pommes serrés dans le caramel, debout en rosace. Cuire 5 minutes.", "timer": 5},
                    {"order": 5, "instruction": "Recouvrir avec la pâte feuilletée en rentrant bien les bords à l'intérieur du moule.", "timer": None},
                    {"order": 6, "instruction": "Enfourner pour 30 à 35 minutes jusqu'à ce que la pâte soit bien dorée.", "timer": 35},
                    {"order": 7, "instruction": "Laisser tiédir 5 minutes puis démouler en retournant la tarte sur un plat. Attention au caramel chaud !", "timer": None},
                    {"order": 8, "instruction": "Servir tiède avec une boule de glace vanille ou de la crème fraîche.", "timer": None},
                ],
            },
            {
                "title": "Soupe à l'Oignon Gratinée",
                "description": "Un grand classique des bistrots parisiens. Une soupe réconfortante aux oignons caramélisés, gratinée au fromage.",
                "category": "soupes-potages",
                "difficulty": Difficulty.easy,
                "prep_time": 15,
                "cook_time": 50,
                "servings": 4,
                "serving_unit": "personnes",
                "is_vegetarian": True,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 1, "unit": "kg", "name": "oignons jaunes", "order": 0},
                    {"quantity": 50, "unit": "g", "name": "beurre", "order": 1},
                    {"quantity": 1, "unit": "l", "name": "bouillon de légumes", "order": 2},
                    {"quantity": 15, "unit": "cl", "name": "vin blanc sec", "order": 3},
                    {"quantity": 1, "unit": "c. à soupe", "name": "farine", "order": 4},
                    {"quantity": 4, "unit": "tranches", "name": "pain de campagne", "order": 5},
                    {"quantity": 200, "unit": "g", "name": "gruyère râpé", "order": 6},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 7},
                ],
                "steps": [
                    {"order": 1, "instruction": "Éplucher et émincer finement les oignons.", "timer": None},
                    {"order": 2, "instruction": "Dans une grande cocotte, faire fondre le beurre et y faire revenir les oignons à feu doux pendant 30 minutes jusqu'à ce qu'ils soient bien caramélisés. Remuer régulièrement.", "timer": 30},
                    {"order": 3, "instruction": "Saupoudrer de farine, bien mélanger et cuire 2 minutes.", "timer": 2},
                    {"order": 4, "instruction": "Déglacer avec le vin blanc, laisser évaporer puis ajouter le bouillon. Saler et poivrer.", "timer": None},
                    {"order": 5, "instruction": "Laisser mijoter 15 minutes à feu doux.", "timer": 15},
                    {"order": 6, "instruction": "Préchauffer le gril du four. Répartir la soupe dans des bols allant au four.", "timer": None},
                    {"order": 7, "instruction": "Déposer une tranche de pain sur chaque bol, recouvrir généreusement de gruyère râpé.", "timer": None},
                    {"order": 8, "instruction": "Passer sous le gril 3 à 5 minutes jusqu'à ce que le fromage soit doré et gratiné. Servir immédiatement.", "timer": 5},
                ],
            },
            {
                "title": "Quiche Lorraine",
                "description": "La vraie quiche lorraine, garnie de lardons et d'une onctueuse crème aux œufs. Un classique de l'est de la France.",
                "category": "entrees",
                "difficulty": Difficulty.easy,
                "prep_time": 20,
                "cook_time": 35,
                "servings": 6,
                "serving_unit": "parts",
                "is_vegetarian": False,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 1, "unit": None, "name": "pâte brisée", "order": 0},
                    {"quantity": 200, "unit": "g", "name": "lardons fumés", "order": 1},
                    {"quantity": 3, "unit": None, "name": "œufs", "order": 2},
                    {"quantity": 20, "unit": "cl", "name": "crème fraîche épaisse", "order": 3},
                    {"quantity": 20, "unit": "cl", "name": "lait entier", "order": 4},
                    {"quantity": None, "unit": None, "name": "noix de muscade", "order": 5},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 6},
                ],
                "steps": [
                    {"order": 1, "instruction": "Préchauffer le four à 180°C.", "timer": None},
                    {"order": 2, "instruction": "Étaler la pâte brisée dans un moule à tarte beurré. Piquer le fond avec une fourchette.", "timer": None},
                    {"order": 3, "instruction": "Faire revenir les lardons dans une poêle sans matière grasse jusqu'à ce qu'ils soient dorés. Égoutter sur du papier absorbant.", "timer": 5},
                    {"order": 4, "instruction": "Répartir les lardons sur le fond de tarte.", "timer": None},
                    {"order": 5, "instruction": "Dans un bol, battre les œufs avec la crème fraîche et le lait. Assaisonner avec du sel, du poivre et une pincée de noix de muscade.", "timer": None},
                    {"order": 6, "instruction": "Verser la préparation sur les lardons.", "timer": None},
                    {"order": 7, "instruction": "Enfourner pour 30 à 35 minutes jusqu'à ce que la quiche soit bien dorée et la crème prise.", "timer": 35},
                    {"order": 8, "instruction": "Laisser tiédir quelques minutes avant de servir. Délicieux avec une salade verte.", "timer": None},
                ],
            },
            {
                "title": "Crème Brûlée",
                "description": "Le dessert préféré des français : une crème onctueuse à la vanille surmontée d'une fine couche de sucre caramélisé croquant.",
                "category": "desserts",
                "difficulty": Difficulty.medium,
                "prep_time": 20,
                "cook_time": 45,
                "servings": 6,
                "serving_unit": "ramequins",
                "is_vegetarian": True,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 50, "unit": "cl", "name": "crème liquide entière", "order": 0},
                    {"quantity": 1, "unit": "gousse", "name": "vanille", "order": 1},
                    {"quantity": 6, "unit": None, "name": "jaunes d'œufs", "order": 2},
                    {"quantity": 100, "unit": "g", "name": "sucre en poudre", "order": 3},
                    {"quantity": 6, "unit": "c. à soupe", "name": "cassonade (pour le caramel)", "order": 4},
                ],
                "steps": [
                    {"order": 1, "instruction": "Préchauffer le four à 150°C.", "timer": None},
                    {"order": 2, "instruction": "Fendre la gousse de vanille en deux et gratter les graines. Faire chauffer la crème avec la gousse et les graines jusqu'à frémissement puis retirer du feu.", "timer": None},
                    {"order": 3, "instruction": "Dans un bol, fouetter les jaunes d'œufs avec le sucre jusqu'à ce que le mélange blanchisse.", "timer": None},
                    {"order": 4, "instruction": "Verser progressivement la crème chaude sur les jaunes en fouettant. Retirer la gousse de vanille.", "timer": None},
                    {"order": 5, "instruction": "Répartir la préparation dans 6 ramequins. Les placer dans un plat à gratin rempli d'eau chaude (bain-marie).", "timer": None},
                    {"order": 6, "instruction": "Enfourner pour 40 à 45 minutes. La crème doit être prise mais encore un peu tremblotante au centre.", "timer": 45},
                    {"order": 7, "instruction": "Laisser refroidir puis réfrigérer au moins 3 heures.", "timer": None},
                    {"order": 8, "instruction": "Au moment de servir, saupoudrer uniformément de cassonade et caraméliser au chalumeau ou sous le gril du four. Servir immédiatement.", "timer": None},
                ],
            },
            {
                "title": "Coq au Vin",
                "description": "Un grand classique de la cuisine bourgeoise française : du poulet mijoté dans du vin rouge avec des champignons et des petits oignons.",
                "category": "viandes",
                "difficulty": Difficulty.medium,
                "prep_time": 30,
                "cook_time": 90,
                "servings": 6,
                "serving_unit": "personnes",
                "is_vegetarian": False,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 1, "unit": None, "name": "poulet fermier coupé en morceaux (1,5 kg)", "order": 0},
                    {"quantity": 150, "unit": "g", "name": "lardons fumés", "order": 1},
                    {"quantity": 12, "unit": None, "name": "petits oignons", "order": 2},
                    {"quantity": 250, "unit": "g", "name": "champignons de Paris", "order": 3},
                    {"quantity": 2, "unit": "gousses", "name": "ail", "order": 4},
                    {"quantity": 75, "unit": "cl", "name": "vin rouge corsé", "order": 5},
                    {"quantity": 2, "unit": "c. à soupe", "name": "cognac ou marc", "order": 6},
                    {"quantity": 2, "unit": "c. à soupe", "name": "farine", "order": 7},
                    {"quantity": 30, "unit": "g", "name": "beurre", "order": 8},
                    {"quantity": 1, "unit": None, "name": "bouquet garni", "order": 9},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 10},
                ],
                "steps": [
                    {"order": 1, "instruction": "Faire revenir les lardons dans une cocotte. Les retirer et réserver.", "timer": None},
                    {"order": 2, "instruction": "Dans la même cocotte, faire dorer les morceaux de poulet dans la graisse des lardons. Saler et poivrer. Retirer et réserver.", "timer": 10},
                    {"order": 3, "instruction": "Faire revenir les oignons entiers et les champignons. Réserver avec le poulet.", "timer": 5},
                    {"order": 4, "instruction": "Remettre le poulet dans la cocotte, saupoudrer de farine et bien mélanger. Flamber avec le cognac.", "timer": None},
                    {"order": 5, "instruction": "Verser le vin rouge, ajouter l'ail écrasé et le bouquet garni. Porter à ébullition puis baisser le feu.", "timer": None},
                    {"order": 6, "instruction": "Couvrir et laisser mijoter 1h à feu doux.", "timer": 60},
                    {"order": 7, "instruction": "Ajouter les lardons, oignons et champignons. Poursuivre la cuisson 20 minutes.", "timer": 20},
                    {"order": 8, "instruction": "Hors du feu, incorporer une noix de beurre pour lier la sauce. Servir avec des pommes de terre vapeur ou du riz.", "timer": None},
                ],
            },
            {
                "title": "Salade Niçoise",
                "description": "La célèbre salade du sud de la France, colorée et fraîche, parfaite pour l'été. Une explosion de saveurs méditerranéennes.",
                "category": "salades",
                "difficulty": Difficulty.easy,
                "prep_time": 20,
                "cook_time": 10,
                "servings": 4,
                "serving_unit": "personnes",
                "is_vegetarian": False,
                "is_vegan": False,
                "ingredients": [
                    {"quantity": 4, "unit": None, "name": "tomates bien mûres", "order": 0},
                    {"quantity": 2, "unit": "boîtes", "name": "thon à l'huile d'olive", "order": 1},
                    {"quantity": 4, "unit": None, "name": "œufs", "order": 2},
                    {"quantity": 200, "unit": "g", "name": "haricots verts fins", "order": 3},
                    {"quantity": 1, "unit": None, "name": "poivron vert", "order": 4},
                    {"quantity": 1, "unit": None, "name": "concombre", "order": 5},
                    {"quantity": 8, "unit": None, "name": "filets d'anchois", "order": 6},
                    {"quantity": 100, "unit": "g", "name": "olives noires de Nice", "order": 7},
                    {"quantity": 4, "unit": "c. à soupe", "name": "huile d'olive", "order": 8},
                    {"quantity": 1, "unit": "c. à soupe", "name": "vinaigre de vin", "order": 9},
                    {"quantity": None, "unit": None, "name": "basilic frais", "order": 10},
                    {"quantity": None, "unit": None, "name": "sel et poivre", "order": 11},
                ],
                "steps": [
                    {"order": 1, "instruction": "Cuire les œufs durs pendant 10 minutes. Laisser refroidir puis écaler et couper en quartiers.", "timer": 10},
                    {"order": 2, "instruction": "Cuire les haricots verts à l'eau bouillante salée pendant 8 minutes. Refroidir sous l'eau froide.", "timer": 8},
                    {"order": 3, "instruction": "Laver et couper les tomates en quartiers, le poivron en lanières et le concombre en rondelles.", "timer": None},
                    {"order": 4, "instruction": "Dans un grand saladier, disposer joliment tous les légumes, le thon émietté, les œufs, les anchois et les olives.", "timer": None},
                    {"order": 5, "instruction": "Préparer la vinaigrette en mélangeant l'huile d'olive, le vinaigre, du sel et du poivre.", "timer": None},
                    {"order": 6, "instruction": "Arroser la salade de vinaigrette, parsemer de feuilles de basilic frais.", "timer": None},
                    {"order": 7, "instruction": "Servir frais avec du pain de campagne grillé.", "timer": None},
                ],
            },
        ]

            for recipe_data in recipes_data:
                # Create recipe
                recipe = Recipe(
                    id=str(uuid.uuid4()),
                    title=recipe_data["title"],
                    description=recipe_data["description"],
                    category_id=categories.get(recipe_data["category"]),
                    difficulty=recipe_data["difficulty"],
                    prep_time_minutes=recipe_data["prep_time"],
                    cook_time_minutes=recipe_data["cook_time"],
                    servings=recipe_data["servings"],
                    serving_unit=recipe_data.get("serving_unit"),
                    is_vegetarian=recipe_data["is_vegetarian"],
                    is_vegan=recipe_data["is_vegan"],
                    author_id=author_id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )

                db.add(recipe)
                await db.flush()  # Get the recipe ID

                # Add ingredients
                for ing_data in recipe_data["ingredients"]:
                    ingredient = Ingredient(
                        id=str(uuid.uuid4()),
                        recipe_id=recipe.id,
                        quantity=ing_data.get("quantity"),
                        unit=ing_data.get("unit"),
                        name=ing_data["name"],
                        order=ing_data["order"],
                    )
                    db.add(ingredient)

                # Add steps
                for step_data in recipe_data["steps"]:
                    step = Step(
                        id=str(uuid.uuid4()),
                        recipe_id=recipe.id,
                        order=step_data["order"],
                        instruction=step_data["instruction"],
                        timer_minutes=step_data.get("timer"),
                    )
                    db.add(step)

                print(f"✓ Added recipe: {recipe_data['title']}")

            await db.commit()
            print(f"\n✅ Successfully added {len(recipes_data)} French recipes!")
            

        except Exception as e:
            await db.rollback()
            print(f"❌ Error seeding recipes: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_recipes())
