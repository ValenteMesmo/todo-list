$files = Get-ChildItem "..\";

$keep = ".vs", "build", "todo-app", ".gitignore", "README.md";

foreach ($f in $files){    
    if (-Not $keep.Contains($f.Name))
    {
        Remove-Item $f.FullName -Recurse;
    }
}

npm i;
ng build --prod;
#--delete-output-path=false