<a id="readme-top"></a>

<div align="center">
  <img src="assets/images/tabletop-by-theik-logo.png" alt="Tabletop by Theik" width="420">

  <h1>Tabletop by Theik - Harrowstone</h1>

  <p>
    <strong>Return to the burned ruins of Harrowstone.</strong><br>
    A 67 × 65 multilevel map for Foundry Virtual Tabletop with four main floors and the oubliette below.
  </p>

  <p>
    <a href="https://github.com/Theik/theiks-harrowstone/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/Theik/theiks-harrowstone?style=for-the-badge&sort=semver&color=C78F46"></a>
    <a href="https://foundryvtt.com/"><img alt="Foundry VTT 14" src="https://img.shields.io/badge/Foundry_VTT-14-7A4A35?style=for-the-badge"></a>
    <a href="https://github.com/Theik/theiks-harrowstone/releases"><img alt="Total downloads" src="https://img.shields.io/github/downloads/Theik/theiks-harrowstone/total?style=for-the-badge&color=315949"></a>
    <a href="https://github.com/Theik/theiks-harrowstone/issues"><img alt="Open issues" src="https://img.shields.io/github/issues/Theik/theiks-harrowstone?style=for-the-badge&color=6D597A"></a>
    <a href="https://www.patreon.com/cw/TabletopByTheik"><img alt="Support Tabletop by Theik on Patreon" src="https://img.shields.io/badge/Patreon-Support-FF424D?style=for-the-badge&logo=patreon&logoColor=white"></a>
  </p>

  <p>
    <a href="#the-map">The map</a>
    ·
    <a href="#map-snapshots">Snapshots</a>
    ·
    <a href="#built-in-interactions">Built-in interactions</a>
    ·
    <a href="#required-renderer">Required renderer</a>
    ·
    <a href="#theiks-toolbag">Toolbag</a>
    ·
    <a href="#installation">Installation</a>
  </p>
</div>

> [!IMPORTANT]
> Harrowstone requires [Theik's KTX2 Renderer](https://github.com/Theik/theiks-ktx2-renderer) and is built for **Foundry Virtual Tabletop v14**. The renderer loads the map's tiled KTX2 artwork at the correct floor and zoom level.

## The map

Harrowstone burned down in 4461 AR during an attempted prisoner escape. The ruined prison is haunted now.

| | |
|:--|:--|
| Scene size | 67 × 65 grid squares |
| Main floors | Ground Floor, First Floor, Roof, and Basement |
| Hidden depth | The oubliette forms a fifth mapped area below the prison |

The packaged Scene has its Levels, walls, lighting, doors, stairs, and interactive map elements set up for play.

## Map snapshots

<p align="center">
  <img src="assets/images/screenshots/ground-floor-overview.png" alt="Overview of Harrowstone's burned ground floor and grounds" width="900">
  <br>
  <sub>Ground Floor</sub>
</p>

<table>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/first-floor-overview.png" alt="Overview of Harrowstone's first floor">
      <br><sub>First Floor</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/roof-overview.png" alt="Overview of Harrowstone's roof">
      <br><sub>Roof</sub>
    </td>
  </tr>
</table>

<p align="center">
  <img src="assets/images/screenshots/basement-overview.png" alt="Overview of Harrowstone's dark basement" width="720">
  <br>
  <sub>Basement</sub>
</p>

### Inside the ruins

<table>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/collapsed-roof.png" alt="A collapsed section of Harrowstone's roof">
      <br><sub>Collapsed roof</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/haunted-cells.png" alt="Ruined cells containing the remains of prisoners">
      <br><sub>Haunted cells</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/breached-wall.png" alt="A breached stone wall and scattered rubble">
      <br><sub>Breached walls</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/ruined-outbuilding.png" alt="A ruined outbuilding on the Harrowstone grounds">
      <br><sub>Ruined outbuilding</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/underground-water.png" alt="Dark water beneath Harrowstone">
      <br><sub>Below the prison</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/screenshots/oubliette.png" alt="Bones and abandoned gear in Harrowstone's oubliette">
      <br><sub>No one leaves the oubliette unchanged</sub>
    </td>
  </tr>
</table>

## Required renderer

Harrowstone stores every floor as a multi-resolution KTX2 tile pyramid instead of one very large background image. [Theik's KTX2 Renderer](https://github.com/Theik/theiks-ktx2-renderer) selects the current floor and streams the tiles needed for the visible part of the Scene. It also swaps image density as you zoom. Without the renderer, Foundry cannot display the packaged map backgrounds correctly.

Install the renderer using its manifest URL:

```text
https://github.com/Theik/theiks-ktx2-renderer/releases/latest/download/module.json
```

## Built-in interactions

Animated doors and secret doors are included with Harrowstone. They work without Theik's Toolbag.

<table>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/demos/animated-doors.gif" alt="A prison door opening and closing on the Harrowstone map">
      <br><sub>Animated doors</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/demos/secret-door.gif" alt="A secret door opening on the Harrowstone map">
      <br><sub>Secret doors</sub>
    </td>
  </tr>
</table>

Toolbag only activates the prepared destroyable terrain, stairs, and levers described below.

## Theik's Toolbag

[Theik's Toolbag](https://github.com/Theik/theiks-toolbag) is optional. Harrowstone works without it, but enabling Toolbag activates the Scene's prepared destroyable terrain, working stairs, and usable levers.

The interactions below require Toolbag.

<table>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/demos/breaking-walls.gif" alt="A character breaking through a wall in Harrowstone">
      <br><sub>Breakable walls</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/demos/interactable-portcullis.gif" alt="A character operating a portcullis in Harrowstone">
      <br><sub>Interactable portcullises</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="assets/images/demos/trapdoor.gif" alt="A character opening a trapdoor in Harrowstone">
      <br><sub>Working trapdoors</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/images/demos/stair-scene-transitions.gif" alt="A character using stairs to transition between Scenes in Harrowstone">
      <br><sub>Stair and Scene transitions</sub>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="assets/images/demos/balcony-collapse.gif" alt="A balcony collapsing into rubble in Harrowstone">
      <br><sub>Collapsing balcony</sub>
    </td>
  </tr>
</table>

Install Toolbag using its manifest URL:

```text
https://github.com/Theik/theiks-toolbag/releases/latest/download/module.json
```

## Installation

### Release installation

1. In Foundry, open **Add-on Modules → Install Module**.
2. Install [Theik's KTX2 Renderer](https://github.com/Theik/theiks-ktx2-renderer/releases/latest/download/module.json).
3. Paste the Harrowstone manifest URL below into **Manifest URL** and select **Install**.
4. Enable **Tabletop by Theik - Harrowstone** and **Theik's KTX2 Renderer** from **Manage Modules** in your world.
5. Open **Compendium Packs**, find **Shared Maps**, and import the **Harrowstone** Scene.

```text
https://github.com/Theik/theiks-harrowstone/releases/latest/download/module.json
```

Install [Theik's Toolbag](https://github.com/Theik/theiks-toolbag/releases/latest/download/module.json) as well if you want the interactive terrain, stairs, and levers.

## License, credits, and legal

<div>
  <p>
    <strong>Code:</strong> Original module code and documentation are released under the <a href="LICENSE">MIT License</a>.
  </p>
  <p>
    <strong>Cartography:</strong> The map was created with <a href="https://dungeondraft.net/">Dungeondraft</a> by Megasploot.<br>
    <strong>Artwork:</strong> The map was created using assets from <a href="https://www.forgotten-adventures.net/">Forgotten Adventures</a>.
  </p>
</div>

The MIT License does **not** cover bundled assets, map artwork, or compendium content containing third-party material. Those materials remain subject to their owner's terms. See [Third-Party Notices](THIRD_PARTY_NOTICES.md) for the attribution and license-scope details.

Dungeondraft, Forgotten Adventures, and related names, assets, and marks belong to their respective owners. This project is not affiliated with or endorsed by Megasploot, Tailwind Games, LLC, or Forgotten Adventures.

---

<div align="center">
  <img src="assets/images/tabletop-by-theik-logo.png" alt="Tabletop by Theik" width="180">

  <p><strong>Built by <a href="https://github.com/Theik">Theik</a> for adventurous tables.</strong></p>
  <p>
    <a href="https://github.com/Theik/theiks-harrowstone/releases">Releases</a>
    ·
    <a href="https://github.com/Theik/theiks-harrowstone/issues">Report an issue</a>
    ·
    <a href="https://www.patreon.com/cw/TabletopByTheik">Support on Patreon</a>
    ·
    <a href="#readme-top">Back to top ↑</a>
  </p>
</div>
