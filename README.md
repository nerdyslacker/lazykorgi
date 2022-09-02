# lazykorgi

<p align="center">
  <img src="images/lazykorgi.png">
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

**Enjoy!**
