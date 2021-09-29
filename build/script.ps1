$files = Get-ChildItem "..\";

$keep = ".vs", "build", "todo-app", ".gitignore", "README.md";

foreach ($f in $files){    
    if (-Not $keep.Contains($f.Name))
    {
        Remove-Item $f.FullName -Recurse;
    }
}

npm i;
ng build --configuration production --base-href /todo-list --deploy-url /todo-list/ --delete-output-path=false --output-hashing none --output-path ..\;
#--delete-output-path=false