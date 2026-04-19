import os
import stat
import subprocess
from pathlib import Path


def write_executable(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")
    path.chmod(path.stat().st_mode | stat.S_IXUSR)


def test_entrypoint_exits_after_one_off_migration(tmp_path: Path) -> None:
    app_root = tmp_path / "app"
    bin_dir = tmp_path / "bin"
    app_root.mkdir()
    bin_dir.mkdir()

    marker_dir = tmp_path / "markers"
    marker_dir.mkdir()

    write_executable(
        bin_dir / "alembic",
        f"""#!/bin/sh
set -eu
printf '%s\n' "$@" > "{marker_dir / 'alembic.txt'}"
""",
    )
    write_executable(
        bin_dir / "uvicorn",
        f"""#!/bin/sh
set -eu
printf 'started\n' > "{marker_dir / 'uvicorn.txt'}"
""",
    )

    env = os.environ.copy()
    env["APP_ROOT"] = str(app_root)
    env["PATH"] = f"{bin_dir}:{env['PATH']}"

    result = subprocess.run(
        ["sh", "docker-entrypoint.sh", "--migrate"],
        cwd=Path(__file__).resolve().parent.parent,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 0, result.stderr
    assert (marker_dir / "alembic.txt").read_text(encoding="utf-8").strip() == "upgrade\nhead"
    assert not (marker_dir / "uvicorn.txt").exists()
