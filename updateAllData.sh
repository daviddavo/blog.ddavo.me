#!/bin/bash
set -euo pipefail

if [ ! -f "./updateAllData.sh" ]; then
    echo "This command should be run in the blog root folder!">&2
    exit 1
fi

TEMP=$(getopt -o hudUn --long help,upload,debug,upload-only,dry-run -n 'script.sh' -- "$@")
if [ $? != 0 ] ; then echo "Terminating..." >&2 ; exit 1 ; fi

eval set -- "$TEMP"

# Parse options
usage() {
    echo "Usage: $0"
    printf "  -u,--upload\t\tWether to upload the files to r2\n"
    printf "  -s,--skip-update\tDo not update the data\n"
    printf "  -d,--debug\t\tWether to debug\n"
    printf "  -n,--dry-run\t\tDo not run the commands, just print what should be run\n"
}

upload=false
run_update=true
debug=false
cmd=''
while [[ "$#" -gt 0 ]]; do
    case "$1" in
        -u|--upload)
            upload=true
            shift
            ;;
        -s|--skip-update)
            run_update=false
            shift
            ;;
        -n|--dry-run)
            cmd='echo'
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

if [[ $upload = true ]]; then
    if [[ -z "${AWS_ENDPOINT_URL:-}" ]]; then
        echo 'AWS_ENDPOINT_URL is not defined'>&2
        exit 1
    elif [[ -z "${AWS_BUCKET:-}" ]]; then
        echo 'AWS_BUCKET is not defined'>&2
        exit 1
    fi
fi

if [[ $run_update = true ]]; then
    if [[ -z "${DUNE_API_KEY-}" ]]; then
        echo 'DUNE_API_KEY is not defined'>&2
        exit 1
    fi

    # Use venv or create it
    $cmd python -m venv venv

    # shellchek source=/dev/null
    $cmd source venv/bin/activate
fi


# Find all folders with updateData.py or updateData.sh
find content -iname 'updateData.py' -type f -executable -print0 |
while IFS= read -r -d '' f; do
    if [[ $run_update = true ]]; then
    (
        echo "Running $f/updateData.py">&2
        $cmd cd "$(dirname "${f}")"
        $cmd pip install -r requirements.txt
        $cmd python updateData.py
    )
    fi

    if [[ $upload = true ]]; then
    (
        base=$(dirname "${f}")/data
        for fu in "$base"/*; do
            $cmd aws s3api put-object \
                --bucket "$AWS_BUCKET" \
                --key "${fu#content/}" \
                --body "$fu"
        done
    )
    fi
done
