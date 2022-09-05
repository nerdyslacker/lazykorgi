# lazykorgi

<p align="center">
  <img src="https://user-images.githubusercontent.com/31778860/188382449-3c97221f-db06-4522-87f1-3141e68d8c81.png">
</p>

This extension was created to have an ability to run [DataReply/korgi](https://github.com/DataReply/korgi) commands from the VSCode context menu. As for now only 3 options are available:

- Lazy korgi apply
- Lazy korgi delete
- Lazy korgi dry run

Depends on a very opinionated deployment structure:
```yaml
realm
   values
        env
            {app_environment}
                {app_namespace}
                    {app_group}
                        {app_dir}
                            app.yaml
```
Just right click on the `app.yaml` and choose one of the `lazykorgi` commands.

<p align="center">
  <img src="https://user-images.githubusercontent.com/31778860/188382531-32f28fa4-1a5f-4e02-a116-e93bc29da43f.gif">
</p>

**Enjoy!**
