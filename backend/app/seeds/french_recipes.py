from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.recipe import Difficulty, Ingredient, Recipe, Step
from app.models.user import User
from app.seeds.default_categories import seed_default_categories


@dataclass(frozen=True)
class IngredientSeed:
    name: str
    quantity: float | int | None = None
    unit: str | None = None
    is_scalable: bool = True


@dataclass(frozen=True)
class StepSeed:
    instruction: str
    timer_minutes: int | None = None
    note: str | None = None


@dataclass(frozen=True)
class RecipeSeed:
    title: str
    description: str
    category_slug: str
    source: str
    ingredients: tuple[IngredientSeed, ...]
    steps: tuple[StepSeed, ...]
    difficulty: Difficulty = Difficulty.easy
    prep_time_minutes: int | None = None
    cook_time_minutes: int | None = None
    servings: int = 4
    serving_unit: str | None = "personnes"
    is_vegetarian: bool = False
    is_vegan: bool = False


@dataclass(frozen=True)
class SeedFrenchRecipesResult:
    created_categories: int
    created_recipes: int
    skipped_recipes: int


def ingredient(
    name: str,
    quantity: float | int | None = None,
    unit: str | None = None,
    *,
    is_scalable: bool = True,
) -> IngredientSeed:
    return IngredientSeed(
        name=name,
        quantity=quantity,
        unit=unit,
        is_scalable=is_scalable,
    )


def step(
    instruction: str,
    *,
    timer_minutes: int | None = None,
    note: str | None = None,
) -> StepSeed:
    return StepSeed(
        instruction=instruction,
        timer_minutes=timer_minutes,
        note=note,
    )


def recipe(
    title: str,
    *,
    description: str,
    category: str,
    source: str,
    ingredients: Iterable[IngredientSeed],
    steps: Iterable[StepSeed],
    difficulty: Difficulty = Difficulty.easy,
    prep: int | None = None,
    cook: int | None = None,
    servings: int = 4,
    serving_unit: str | None = "personnes",
    vegetarian: bool = False,
    vegan: bool = False,
) -> RecipeSeed:
    return RecipeSeed(
        title=title,
        description=description,
        category_slug=category,
        source=source,
        ingredients=tuple(ingredients),
        steps=tuple(steps),
        difficulty=difficulty,
        prep_time_minutes=prep,
        cook_time_minutes=cook,
        servings=servings,
        serving_unit=serving_unit,
        is_vegetarian=vegetarian,
        is_vegan=vegan,
    )


FRENCH_RECIPES: tuple[RecipeSeed, ...] = (
    recipe(
        "Bœuf bourguignon",
        description="Un grand classique bourguignon mijoté au vin rouge avec des légumes et une sauce longue cuisson.",
        category="viandes",
        source="https://www.marmiton.org/recettes/recette_boeuf-bourguignon_18889.aspx",
        difficulty=Difficulty.medium,
        prep=30,
        cook=180,
        servings=6,
        ingredients=(
            ingredient("bœuf à braiser", 1.2, "kg"),
            ingredient("carottes", 4),
            ingredient("oignons", 2),
            ingredient("lardons fumés", 150, "g"),
            ingredient("vin rouge", 75, "cl"),
            ingredient("bouquet garni", 1),
            ingredient("champignons de Paris", 250, "g"),
            ingredient("farine", 2, "c. à soupe"),
        ),
        steps=(
            step("Faire revenir les lardons puis saisir les morceaux de bœuf dans une cocotte.", timer_minutes=12),
            step("Ajouter les oignons, les carottes et la farine, puis bien enrober la viande."),
            step("Mouiller avec le vin rouge et un peu d'eau, ajouter le bouquet garni et couvrir."),
            step("Laisser mijoter à feu doux jusqu'à ce que la viande soit fondante.", timer_minutes=180),
            step("Ajouter les champignons poêlés en fin de cuisson et servir très chaud."),
        ),
    ),
    recipe(
        "Blanquette de veau",
        description="Une blanquette douce et crémeuse, servie avec sa sauce liée au bouillon et aux jaunes d'œufs.",
        category="viandes",
        source="https://www.marmiton.org/recettes/recette_blanquette-de-veau-de-meres-en-filles_65329.aspx",
        difficulty=Difficulty.medium,
        prep=25,
        cook=105,
        servings=6,
        ingredients=(
            ingredient("veau pour blanquette", 1, "kg"),
            ingredient("carottes", 3),
            ingredient("oignon", 1),
            ingredient("champignons", 200, "g"),
            ingredient("beurre", 40, "g"),
            ingredient("farine", 40, "g"),
            ingredient("crème fraîche", 20, "cl"),
            ingredient("jaunes d'œufs", 2),
        ),
        steps=(
            step("Couvrir le veau d'eau froide, porter à frémissement puis écumer."),
            step("Ajouter oignon, carottes et assaisonnement, puis cuire doucement.", timer_minutes=90),
            step("Préparer un roux avec le beurre et la farine, puis détendre avec du bouillon filtré."),
            step("Ajouter la crème et les jaunes hors du feu pour finir la sauce."),
            step("Remettre le veau et les champignons dans la sauce et servir avec du riz."),
        ),
    ),
    recipe(
        "Brandade de morue",
        description="Une brandade nîmoise crémeuse à base de morue effeuillée, de pomme de terre et d'huile d'olive.",
        category="poissons",
        source="https://www.marmiton.org/recettes/recette_brandade-de-morue-facile_21103.aspx",
        difficulty=Difficulty.medium,
        prep=30,
        cook=45,
        servings=4,
        ingredients=(
            ingredient("morue dessalée", 400, "g"),
            ingredient("pommes de terre", 400, "g"),
            ingredient("lait", 20, "cl"),
            ingredient("huile d'olive", 15, "cl"),
            ingredient("ail", 1, "gousse"),
            ingredient("jus de citron", 1, "c. à soupe"),
        ),
        steps=(
            step("Pocher la morue quelques minutes puis l'effeuiller soigneusement."),
            step("Cuire les pommes de terre et les écraser avec l'ail."),
            step("Monter la brandade en incorporant morue, purée, lait chaud et huile d'olive."),
            step("Assaisonner au citron, transférer dans un plat et faire gratiner.", timer_minutes=15),
        ),
    ),
    recipe(
        "Sole meunière",
        description="Une préparation très classique où le poisson fariné est nappé d'un beurre noisette citronné.",
        category="poissons",
        source="https://www.marmiton.org/recettes/recette_sole-meuniere_165182.aspx",
        difficulty=Difficulty.medium,
        prep=10,
        cook=10,
        servings=2,
        ingredients=(
            ingredient("soles prêtes à cuire", 2),
            ingredient("farine", 4, "c. à soupe"),
            ingredient("beurre", 50, "g"),
            ingredient("huile neutre", 1, "c. à soupe"),
            ingredient("citron", 1),
            ingredient("persil", 0.5, "botte"),
        ),
        steps=(
            step("Fariner légèrement les soles et les assaisonner."),
            step("Les cuire dans une poêle chaude avec un peu d'huile jusqu'à coloration des deux côtés.", timer_minutes=8),
            step("Ajouter le beurre pour le faire mousser et arroser le poisson."),
            step("Finir avec le jus de citron et le persil avant de servir aussitôt."),
        ),
    ),
    recipe(
        "Ratatouille",
        description="Les légumes du soleil sont cuits séparément puis réunis pour un mijotage final à la provençale.",
        category="plats-accompagnements",
        source="https://www.marmiton.org/recettes/recette_ratatouille_23223.aspx",
        prep=25,
        cook=55,
        servings=4,
        vegetarian=True,
        vegan=True,
        ingredients=(
            ingredient("aubergine", 1),
            ingredient("courgettes", 2),
            ingredient("poivrons", 2),
            ingredient("tomates", 5),
            ingredient("oignon", 1),
            ingredient("ail", 2, "gousses"),
            ingredient("huile d'olive", 4, "c. à soupe"),
            ingredient("thym et laurier", 1),
        ),
        steps=(
            step("Couper les légumes en morceaux réguliers."),
            step("Faire fondre l'oignon et les poivrons dans l'huile d'olive.", timer_minutes=10),
            step("Ajouter les tomates, l'ail et les herbes, puis laisser compoter à couvert.", timer_minutes=35),
            step("Poêler séparément les courgettes et l'aubergine avant de les réunir à la sauce."),
            step("Poursuivre la cuisson quelques minutes et servir chaud, tiède ou froid.", timer_minutes=10),
        ),
    ),
    recipe(
        "Gratin dauphinois",
        description="Des pommes de terre fondantes cuites lentement dans la crème, relevées d'ail et de muscade.",
        category="plats-accompagnements",
        source="https://www.marmiton.org/recettes/recette_gratin-dauphinois_13809.aspx",
        prep=20,
        cook=75,
        servings=6,
        vegetarian=True,
        ingredients=(
            ingredient("pommes de terre", 1.5, "kg"),
            ingredient("crème liquide", 60, "cl"),
            ingredient("lait", 20, "cl"),
            ingredient("ail", 1, "gousse"),
            ingredient("beurre", 20, "g"),
            ingredient("noix de muscade", None),
        ),
        steps=(
            step("Éplucher les pommes de terre et les couper en fines rondelles."),
            step("Frotter un plat avec l'ail, beurrer puis disposer les pommes de terre en couches."),
            step("Napper avec le mélange crème-lait assaisonné et ajouter un peu de muscade."),
            step("Cuire jusqu'à ce que les pommes de terre soient très fondantes et la surface dorée.", timer_minutes=75),
        ),
    ),
    recipe(
        "Quiche lorraine",
        description="Une quiche généreuse aux lardons et à l'appareil œufs-crème, parfaite avec une salade verte.",
        category="entrees",
        source="https://www.marmiton.org/recettes/recette_quiche-lorraine-de-sophie_57113.aspx",
        prep=20,
        cook=35,
        servings=6,
        serving_unit="parts",
        ingredients=(
            ingredient("pâte brisée", 1),
            ingredient("lardons fumés", 200, "g"),
            ingredient("œufs", 3),
            ingredient("crème fraîche", 25, "cl"),
            ingredient("lait", 10, "cl"),
            ingredient("muscade", None),
        ),
        steps=(
            step("Foncer un moule avec la pâte et piquer le fond."),
            step("Faire revenir les lardons, puis les répartir sur la pâte.", timer_minutes=5),
            step("Mélanger œufs, crème, lait et muscade puis verser sur les lardons."),
            step("Cuire au four jusqu'à prise complète et belle coloration.", timer_minutes=35),
        ),
    ),
    recipe(
        "Œufs mimosa",
        description="Une entrée froide familiale où les jaunes d'œufs sont mêlés à la mayonnaise et à la moutarde.",
        category="entrees",
        source="https://www.marmiton.org/recettes/recette_oeufs-mimosa_28602.aspx",
        prep=20,
        cook=10,
        servings=4,
        vegetarian=True,
        serving_unit="personnes",
        ingredients=(
            ingredient("œufs", 6),
            ingredient("mayonnaise", 4, "c. à soupe"),
            ingredient("moutarde de Dijon", 1, "c. à café"),
            ingredient("persil", 0.25, "botte"),
            ingredient("salade verte", 1, "poignée"),
        ),
        steps=(
            step("Cuire les œufs durs puis les refroidir rapidement.", timer_minutes=10),
            step("Les couper en deux, récupérer les jaunes et les écraser avec mayonnaise, moutarde et persil."),
            step("Garnir les blancs avec cette farce puis parsemer d'un peu de jaune émietté."),
            step("Servir bien frais sur quelques feuilles de salade."),
        ),
    ),
    recipe(
        "Soupe à l'oignon gratinée",
        description="Une soupe de bistrot aux oignons caramélisés, pain grillé et fromage fondu.",
        category="soupes-potages",
        source="https://www.marmiton.org/recettes/recette_soupe-a-l-oignon-gratinee_20864.aspx",
        prep=15,
        cook=40,
        servings=4,
        vegetarian=True,
        ingredients=(
            ingredient("oignons jaunes", 1, "kg"),
            ingredient("beurre", 45, "g"),
            ingredient("farine", 1, "c. à soupe"),
            ingredient("bouillon de légumes", 1.5, "l"),
            ingredient("pain de campagne", 4, "tranches"),
            ingredient("fromage râpé", 120, "g"),
        ),
        steps=(
            step("Émincer les oignons et les faire confire dans le beurre jusqu'à belle coloration.", timer_minutes=20),
            step("Singer avec la farine, mouiller avec le bouillon et laisser cuire doucement.", timer_minutes=20),
            step("Répartir dans des bols, couvrir de pain grillé puis de fromage."),
            step("Passer sous le gril jusqu'à ce que le dessus soit bien doré.", timer_minutes=5),
        ),
    ),
    recipe(
        "Velouté poireaux pommes de terre",
        description="Un velouté simple, doux et crémeux, très typique des soupes familiales de semaine.",
        category="soupes-potages",
        source="https://www.marmiton.org/recettes/recette_potage-veloute-poireaux-pommes-de-terre_18971.aspx",
        prep=10,
        cook=30,
        servings=4,
        vegetarian=True,
        ingredients=(
            ingredient("poireaux", 2),
            ingredient("pommes de terre", 3),
            ingredient("beurre", 30, "g"),
            ingredient("eau", 50, "cl"),
            ingredient("lait", 50, "cl"),
            ingredient("crème fraîche", 2, "c. à soupe"),
        ),
        steps=(
            step("Faire suer les poireaux émincés dans le beurre.", timer_minutes=5),
            step("Ajouter les pommes de terre en morceaux, puis verser l'eau et le lait."),
            step("Cuire jusqu'à ce que les légumes soient très tendres.", timer_minutes=25),
            step("Mixer finement, ajouter la crème puis rectifier l'assaisonnement."),
        ),
    ),
    recipe(
        "Salade niçoise",
        description="Une salade méditerranéenne composée de tomates, œufs, thon, olives et légumes croquants.",
        category="salades",
        source="https://www.cuisinenicoise.fr/salade-nicoise/",
        prep=25,
        cook=10,
        servings=4,
        ingredients=(
            ingredient("tomates", 4),
            ingredient("œufs", 4),
            ingredient("thon à l'huile", 200, "g"),
            ingredient("cébettes ou oignon nouveau", 2),
            ingredient("poivron vert", 1),
            ingredient("radis", 8),
            ingredient("olives noires", 80, "g"),
            ingredient("huile d'olive", 4, "c. à soupe"),
        ),
        steps=(
            step("Cuire les œufs durs et les couper en quartiers.", timer_minutes=10),
            step("Préparer et couper les légumes en morceaux ou en fines lamelles."),
            step("Dresser tomates, légumes, thon, olives et œufs sur un grand plat."),
            step("Assaisonner à l'huile d'olive, au vinaigre et au poivre juste avant de servir."),
        ),
    ),
    recipe(
        "Salade de lentilles",
        description="Une salade rustique servie tiède ou froide, relevée d'une vinaigrette moutardée et d'herbes fraîches.",
        category="salades",
        source="https://www.marmiton.org/recettes/recette_delicieuse-salade-de-lentilles_168181.aspx",
        prep=15,
        cook=25,
        servings=4,
        vegetarian=True,
        ingredients=(
            ingredient("lentilles vertes", 250, "g"),
            ingredient("carotte", 1),
            ingredient("échalote", 1),
            ingredient("moutarde de Dijon", 1, "c. à soupe"),
            ingredient("vinaigre de vin", 2, "c. à soupe"),
            ingredient("huile", 3, "c. à soupe"),
            ingredient("persil", 0.25, "botte"),
        ),
        steps=(
            step("Cuire les lentilles dans une eau frémissante non salée jusqu'à tendreté.", timer_minutes=25),
            step("Préparer une vinaigrette avec moutarde, vinaigre et huile."),
            step("Mélanger les lentilles égouttées avec carotte râpée, échalote et persil."),
            step("Assaisonner encore tiède pour que les saveurs se diffusent bien."),
        ),
    ),
    recipe(
        "Crème brûlée",
        description="Le contraste entre la crème vanillée et la fine croûte caramélisée en fait un incontournable.",
        category="desserts",
        source="https://www.marmiton.org/recettes/recette_creme-brulee_11491.aspx",
        difficulty=Difficulty.medium,
        prep=20,
        cook=50,
        servings=6,
        serving_unit="ramequins",
        vegetarian=True,
        ingredients=(
            ingredient("crème liquide entière", 40, "cl"),
            ingredient("lait", 25, "cl"),
            ingredient("jaunes d'œufs", 6),
            ingredient("sucre", 120, "g"),
            ingredient("vanille", 1, "gousse"),
            ingredient("cassonade", 6, "c. à café"),
        ),
        steps=(
            step("Chauffer lait, crème et vanille sans faire bouillir."),
            step("Mélanger les jaunes avec le sucre puis verser doucement le mélange chaud."),
            step("Répartir dans des ramequins et cuire au bain-marie.", timer_minutes=50),
            step("Refroidir complètement puis caraméliser la surface au dernier moment."),
        ),
    ),
    recipe(
        "Île flottante",
        description="Des blancs montés et pochés servis sur une crème anglaise avec un peu de caramel.",
        category="desserts",
        source="https://www.marmiton.org/recettes/recette_iles-flottantes_22034.aspx",
        difficulty=Difficulty.medium,
        prep=30,
        cook=20,
        servings=6,
        vegetarian=True,
        ingredients=(
            ingredient("œufs", 6),
            ingredient("lait", 1, "l"),
            ingredient("sucre", 150, "g"),
            ingredient("vanille", 1, "gousse"),
            ingredient("amandes effilées", 30, "g"),
        ),
        steps=(
            step("Préparer une crème anglaise avec le lait, la vanille, les jaunes et une partie du sucre."),
            step("Monter les blancs en neige avec un peu de sucre."),
            step("Pocher les blancs par quenelles dans un lait frémissant.", timer_minutes=5),
            step("Servir les blancs sur la crème et décorer d'amandes et d'un filet de caramel."),
        ),
    ),
    recipe(
        "Tarte tatin",
        description="Une tarte renversée aux pommes caramélisées, servie tiède pour garder tout son fondant.",
        category="patisseries",
        source="https://www.marmiton.org/recettes/recette_tarte-tatin_12456.aspx",
        difficulty=Difficulty.medium,
        prep=30,
        cook=40,
        servings=8,
        serving_unit="parts",
        vegetarian=True,
        ingredients=(
            ingredient("pommes", 8),
            ingredient("pâte feuilletée", 1),
            ingredient("beurre", 100, "g"),
            ingredient("sucre", 100, "g"),
            ingredient("sucre vanillé", 2, "sachets"),
        ),
        steps=(
            step("Préparer un caramel blond avec le beurre et le sucre dans le moule."),
            step("Disposer les pommes épluchées et les laisser compoter un peu dans le caramel.", timer_minutes=10),
            step("Recouvrir de pâte en rentrant les bords vers l'intérieur."),
            step("Cuire jusqu'à ce que la pâte soit bien dorée puis retourner encore tiède.", timer_minutes=35),
        ),
    ),
    recipe(
        "Clafoutis aux cerises",
        description="Un gâteau flanqué de cerises bien mûres, à mi-chemin entre le flan et le gâteau de voyage.",
        category="patisseries",
        source="https://cuisine.journaldesfemmes.fr/recette/318093-clafoutis-aux-cerises",
        prep=15,
        cook=40,
        servings=6,
        serving_unit="parts",
        vegetarian=True,
        ingredients=(
            ingredient("cerises", 500, "g"),
            ingredient("œufs", 4),
            ingredient("farine", 100, "g"),
            ingredient("sucre", 120, "g"),
            ingredient("lait", 35, "cl"),
            ingredient("beurre", 20, "g"),
        ),
        steps=(
            step("Beurrer le moule puis y répartir les cerises."),
            step("Fouetter les œufs, le sucre, la farine et le lait pour obtenir une pâte fluide."),
            step("Verser l'appareil sur les fruits."),
            step("Cuire jusqu'à ce que le centre soit pris et les bords légèrement dorés.", timer_minutes=40),
        ),
    ),
    recipe(
        "Vinaigrette à la moutarde",
        description="La base la plus utile du carnet de cuisine, idéale pour les salades vertes et lentilles.",
        category="sauces-condiments",
        source="https://www.marmiton.org/recettes/recette_vinaigrette-simple-et-rapide_81523.aspx",
        prep=5,
        servings=1,
        serving_unit="bol",
        vegetarian=True,
        vegan=True,
        ingredients=(
            ingredient("moutarde de Dijon", 1, "c. à café"),
            ingredient("vinaigre de vin", 2, "c. à soupe"),
            ingredient("huile d'olive", 3, "c. à soupe"),
            ingredient("sel et poivre", None, is_scalable=False),
        ),
        steps=(
            step("Mélanger moutarde, vinaigre, sel et poivre dans un bol."),
            step("Ajouter l'huile en filet en fouettant jusqu'à émulsion."),
            step("Utiliser aussitôt ou conserver au frais une journée."),
        ),
    ),
    recipe(
        "Mayonnaise maison",
        description="Une mayonnaise simple, montée à la main, utile pour les œufs mimosa et les crudités.",
        category="sauces-condiments",
        source="https://www.marmiton.org/recettes/recette_mayonnaise-maison_26184.aspx",
        prep=10,
        servings=1,
        serving_unit="pot",
        vegetarian=True,
        ingredients=(
            ingredient("jaune d'œuf", 1),
            ingredient("moutarde de Dijon", 1, "c. à soupe"),
            ingredient("huile neutre", 10, "cl"),
            ingredient("vinaigre", 1, "trait", is_scalable=False),
            ingredient("sel et poivre", None, is_scalable=False),
        ),
        steps=(
            step("Mélanger le jaune, la moutarde, le sel et le vinaigre."),
            step("Verser l'huile goutte à goutte puis en filet en fouettant sans s'arrêter."),
            step("Poivrer, rectifier la texture et réserver au frais."),
        ),
    ),
    recipe(
        "Chocolat chaud à l'ancienne",
        description="Une boisson épaisse et réconfortante, servie bien chaude les matins d'hiver.",
        category="boissons",
        source="https://www.marmiton.org/recettes/recette_le-chocolat-chaud-a-l-ancienne-de-ma-mamie_80223.aspx",
        prep=5,
        cook=10,
        servings=4,
        serving_unit="tasses",
        vegetarian=True,
        ingredients=(
            ingredient("chocolat noir ou au lait pâtissier", 200, "g"),
            ingredient("lait entier", 1, "l"),
            ingredient("crème fraîche", 4, "c. à café"),
            ingredient("sucre", 1, "c. à soupe"),
        ),
        steps=(
            step("Faire fondre le chocolat doucement avec un peu de lait."),
            step("Ajouter le reste du lait et fouetter jusqu'à consistance lisse.", timer_minutes=8),
            step("Finir avec la crème pour une texture plus veloutée et servir aussitôt."),
        ),
    ),
    recipe(
        "Limonade à l'ancienne",
        description="Une boisson fermentée légère et très maison, infusée avec citron, sucre et sureau.",
        category="boissons",
        source="https://www.marmiton.org/recettes/recette_limonade-a-l-ancienne-maison_359583.aspx",
        prep=10,
        cook=3,
        servings=8,
        serving_unit="verres",
        vegetarian=True,
        vegan=True,
        ingredients=(
            ingredient("eau", 5, "l"),
            ingredient("citrons", 2),
            ingredient("sucre", 500, "g"),
            ingredient("fleurs de sureau", 4),
            ingredient("vinaigre blanc", 1, "c. à soupe"),
            ingredient("raisins secs", 1, "poignée"),
        ),
        steps=(
            step("Faire bouillir l'eau quelques minutes puis la laisser refroidir."),
            step("Mettre l'eau dans un grand bocal avec citron, sucre, sureau, vinaigre et raisins."),
            step("Laisser fermenter à couvert pendant trois jours en remuant ou retournant le bocal chaque jour.", timer_minutes=4320),
            step("Filtrer, embouteiller et servir bien frais."),
        ),
    ),
    recipe(
        "Crêpes",
        description="Une pâte à crêpes classique pour le petit-déjeuner ou le goûter, à garnir selon les envies.",
        category="petit-dejeuner",
        source="https://www.marmiton.org/recettes/recette_pate-a-crepes-facile_86163.aspx",
        prep=10,
        cook=15,
        servings=10,
        serving_unit="crêpes",
        vegetarian=True,
        ingredients=(
            ingredient("farine", 250, "g"),
            ingredient("œufs", 2),
            ingredient("lait", 25, "cl"),
            ingredient("eau", 25, "cl"),
            ingredient("huile", 2, "c. à soupe"),
            ingredient("sucre", 1, "c. à soupe"),
        ),
        steps=(
            step("Mélanger la farine avec les œufs puis détendre avec le lait et l'eau."),
            step("Ajouter l'huile et laisser reposer si possible.", timer_minutes=30),
            step("Cuire de fines louches de pâte dans une poêle chaude jusqu'à légère coloration des deux côtés.", timer_minutes=15),
        ),
    ),
    recipe(
        "Pain perdu",
        description="Une recette anti-gaspi très française pour transformer du pain rassis en petit-déjeuner gourmand.",
        category="petit-dejeuner",
        source="https://www.marmiton.org/recettes/recette_pain-perdu-de-ma-mamie-bernadette_72975.aspx",
        prep=10,
        cook=10,
        servings=4,
        serving_unit="tranches",
        vegetarian=True,
        ingredients=(
            ingredient("pain rassis", 8, "tranches"),
            ingredient("lait", 25, "cl"),
            ingredient("œufs", 2),
            ingredient("beurre", 25, "g"),
            ingredient("sucre", 2, "c. à soupe"),
        ),
        steps=(
            step("Couper le pain en tranches épaisses et battre les œufs dans une assiette creuse."),
            step("Tremper le pain dans le lait puis dans les œufs battus."),
            step("Faire dorer au beurre sur chaque face.", timer_minutes=10),
            step("Servir saupoudré de sucre."),
        ),
    ),
    recipe(
        "Gougères",
        description="De petites bouchées bourguignonnes à la pâte à choux et au fromage, servies tièdes à l'apéritif.",
        category="aperitifs",
        source="https://www.marmiton.org/recettes/recette_gougere-en-couronne-de-ma-grand-mere_228043.aspx",
        difficulty=Difficulty.medium,
        prep=20,
        cook=30,
        servings=20,
        serving_unit="bouchées",
        vegetarian=True,
        ingredients=(
            ingredient("eau", 25, "cl"),
            ingredient("beurre", 75, "g"),
            ingredient("farine", 150, "g"),
            ingredient("œufs", 4),
            ingredient("comté ou gruyère râpé", 120, "g"),
        ),
        steps=(
            step("Porter l'eau et le beurre à ébullition puis verser la farine d'un coup."),
            step("Dessécher la panade sur le feu puis incorporer les œufs un à un."),
            step("Ajouter le fromage, pocher de petits tas et enfourner."),
            step("Cuire jusqu'à ce que les gougères soient bien gonflées et dorées.", timer_minutes=30),
        ),
    ),
    recipe(
        "Tapenade noire",
        description="Une tartinade provençale puissante à base d'olives noires, d'anchois et de câpres.",
        category="aperitifs",
        source="https://www.marmiton.org/recettes/recette_tapenade-noire-bien-relevee_26398.aspx",
        prep=10,
        servings=1,
        serving_unit="bol",
        ingredients=(
            ingredient("olives noires dénoyautées", 200, "g"),
            ingredient("anchois à l'huile", 50, "g"),
            ingredient("câpres", 100, "g"),
            ingredient("ail", 2, "gousses"),
            ingredient("huile d'olive", 10, "cl"),
            ingredient("jus de citron", 1, "c. à soupe"),
        ),
        steps=(
            step("Mixer olives, câpres, anchois et ail jusqu'à obtenir une pâte grossière."),
            step("Ajouter le jus de citron puis l'huile d'olive progressivement."),
            step("Servir sur des toasts ou avec des crudités."),
        ),
    ),
)


async def seed_french_recipes(db: AsyncSession) -> SeedFrenchRecipesResult:
    created_categories = await seed_default_categories(db)

    admin_result = await db.execute(
        select(User).where(User.is_admin.is_(True)).order_by(User.created_at, User.username)
    )
    admin_user = admin_result.scalars().first()
    if admin_user is None:
        raise ValueError("An admin user is required before seeding French recipes.")

    category_result = await db.execute(select(Category.slug, Category.id))
    category_ids = {row[0]: row[1] for row in category_result}

    missing_categories = {
        recipe_seed.category_slug
        for recipe_seed in FRENCH_RECIPES
        if recipe_seed.category_slug not in category_ids
    }
    if missing_categories:
        missing_list = ", ".join(sorted(missing_categories))
        raise ValueError(f"Missing categories for recipe seed: {missing_list}")

    existing_titles_result = await db.execute(select(Recipe.title))
    existing_titles = {title.strip().casefold() for title in existing_titles_result.scalars()}

    created_recipes = 0
    skipped_recipes = 0
    now = datetime.utcnow()

    for recipe_seed in FRENCH_RECIPES:
        normalized_title = recipe_seed.title.strip().casefold()
        if normalized_title in existing_titles:
            skipped_recipes += 1
            continue

        recipe_model = Recipe(
            title=recipe_seed.title,
            description=recipe_seed.description,
            prep_time_minutes=recipe_seed.prep_time_minutes,
            cook_time_minutes=recipe_seed.cook_time_minutes,
            servings=recipe_seed.servings,
            serving_unit=recipe_seed.serving_unit,
            difficulty=recipe_seed.difficulty,
            source=recipe_seed.source,
            category_id=category_ids[recipe_seed.category_slug],
            author_id=admin_user.id,
            is_vegetarian=recipe_seed.is_vegetarian,
            is_vegan=recipe_seed.is_vegan,
            created_at=now,
            updated_at=now,
        )
        db.add(recipe_model)
        await db.flush()

        for order, ingredient_seed in enumerate(recipe_seed.ingredients):
            db.add(
                Ingredient(
                    recipe_id=recipe_model.id,
                    quantity=ingredient_seed.quantity,
                    unit=ingredient_seed.unit,
                    name=ingredient_seed.name,
                    is_scalable=ingredient_seed.is_scalable,
                    order=order,
                )
            )

        for order, step_seed in enumerate(recipe_seed.steps):
            db.add(
                Step(
                    recipe_id=recipe_model.id,
                    order=order,
                    instruction=step_seed.instruction,
                    timer_minutes=step_seed.timer_minutes,
                    note=step_seed.note,
                )
            )

        existing_titles.add(normalized_title)
        created_recipes += 1

    return SeedFrenchRecipesResult(
        created_categories=created_categories,
        created_recipes=created_recipes,
        skipped_recipes=skipped_recipes,
    )
