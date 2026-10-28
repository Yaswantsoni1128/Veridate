"""Temporary file utility with automatic cleanup."""

import logging
import os
import tempfile
from contextlib import contextmanager
from typing import Generator, Optional

logger = logging.getLogger(__name__)


@contextmanager
def temp_file(
    file_bytes: bytes,
    suffix: str = "",
    prefix: str = "verihire_",
    directory: Optional[str] = None,
) -> Generator[str, None, None]:
    """Create a temporary file from bytes and yield its path.

    The file is automatically deleted when the context exits, even if an
    exception occurs inside the block.

    Args:
        file_bytes: Bytes to write to the temporary file.
        suffix: File suffix (e.g. ".pdf").
        prefix: Filename prefix.
        directory: Directory to create the file in (defaults to system temp).

    Yields:
        Absolute path to the temporary file.
    """
    fd, path = tempfile.mkstemp(suffix=suffix, prefix=prefix, dir=directory)
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(file_bytes)
        yield path
    finally:
        try:
            if os.path.exists(path):
                os.remove(path)
                logger.debug("Cleaned up temporary file: %s", path)
        except OSError as exc:
            logger.warning("Failed to clean up temporary file %s: %s", path, exc)
