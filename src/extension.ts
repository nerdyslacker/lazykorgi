import * as fs from 'fs-extra';
import * as path from 'path';

import * as vscode from 'vscode';

/**
 * Korgi apply action.
 */
 async function korgiApply(uri: vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>): Promise<vscode.TextEditor | undefined> {
	const oldPath = uri.fsPath;
	const oldPathParsed = path.parse(oldPath);
	const oldPathStats = await fs.stat(oldPath);

	if(!oldPathParsed.dir.includes(`values${path.sep}env`)){
		vscode.window.showErrorMessage(`You should apply template from values directory.`);
		return;
	}

	if (!oldPathStats.isFile()) {
		vscode.window.showErrorMessage(`You should run this command on a file (yaml/gotmpl).`);
		return;
	}

	const array = oldPathParsed.dir.split(path.sep);
	const appName = array[array.length - 1];
	const appGroup = array[array.length - 2];
	const appNamespace = array[array.length - 3];
	const appEnv = array[array.length - 4];

	let command = `korgi apply -e ${appEnv} -n ${appNamespace} ${appGroup} -a ${appName} --isolate=true --kapp-args="--diff-changes" --dry-run=${dry} --skip-deps=${skipDeps}`;
	
	if(kappArgs && kappArgs.length > 0){
		kappArgs.forEach(arg => {
			command += ` --kapp-args="${arg}"`;
		});
	}

	if(vscode.window.terminals.length === 0){
		const newTerminal = vscode.window.createTerminal(`lazykorgi terminal`);
		newTerminal.show();
		newTerminal.sendText(command);
	}
	else{
		vscode.window.activeTerminal?.show();
		vscode.window.activeTerminal?.sendText(command);
	}

	return;
}

/**
 * Korgi delete action.
 */
 async function korgiDelete(uri: vscode.Uri): Promise<vscode.TextEditor | undefined> {
	const oldPath = uri.fsPath;
	const oldPathParsed = path.parse(oldPath);
	const oldPathStats = await fs.stat(oldPath);

	if(!oldPathParsed.dir.includes(`values${path.sep}env`)){
		vscode.window.showErrorMessage(`You should delete template from values directory.`);
		return;
	}

	if (!oldPathStats.isFile()) {
		vscode.window.showErrorMessage(`You should run this command on a file (yaml/gotmpl).`);
		return;
	}

	const array = oldPathParsed.dir.split(path.sep);
	const appName = array[array.length - 1];
	const appGroup = array[array.length - 2];
	const appNamespace = array[array.length - 3];
	const appEnv = array[array.length - 4];

	const command = `korgi delete -e ${appEnv} -n ${appNamespace} ${appGroup} -a ${appName}`;
	if(vscode.window.terminals.length === 0){
		const newTerminal = vscode.window.createTerminal(`lazykorgi terminal`);
		newTerminal.show();
		newTerminal.sendText(command);
	}
	else{
		vscode.window.activeTerminal?.show();
		vscode.window.activeTerminal?.sendText(command);
	}

	return;
}

export function activate(context: vscode.ExtensionContext) {
	const dryCommand = vscode.commands.registerCommand('lazykorgi.dryrun', (uri: vscode.TextDocument | vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>) => {
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiApply(<vscode.Uri>editor.document.uri, true, true, []);
		}

		return korgiApply(<vscode.Uri>uri, true, true, []);
	});

	context.subscriptions.push(dryCommand);

	const applyCommand = vscode.commands.registerCommand('lazykorgi.apply', (uri: vscode.TextDocument | vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>) => {
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiApply(<vscode.Uri>editor.document.uri, false, false, []);
		}

		return korgiApply(<vscode.Uri>uri, false, false, []);
	});

	context.subscriptions.push(applyCommand);

	const applyWithSkipCommand = vscode.commands.registerCommand('lazykorgi.applyskipping', (uri: vscode.TextDocument | vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>) => {
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiApply(<vscode.Uri>editor.document.uri, false, true, []);
		}

		return korgiApply(<vscode.Uri>uri, false, true, []);
	});

	context.subscriptions.push(applyWithSkipCommand);

	const applyWithOverrideOwnershipCommand = vscode.commands.registerCommand('lazykorgi.applyoverrideownership', (uri: vscode.TextDocument | vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>) => {
		let kappArguments = ["--dangerous-override-ownership-of-existing-resources=true"];
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiApply(<vscode.Uri>editor.document.uri, false, true, kappArguments);
		}

		return korgiApply(<vscode.Uri>uri, false, true, kappArguments);
	});

	context.subscriptions.push(applyWithOverrideOwnershipCommand);

	const applyWithRecreateOverrideOwnershipCommand = vscode.commands.registerCommand('lazykorgi.applyrecreateoverrideownership', (uri: vscode.TextDocument | vscode.Uri, dry: boolean, skipDeps: boolean, kappArgs: Array<string>) => {
		let kappArguments = ["--dangerous-override-ownership-of-existing-resources=true", "--apply-default-update-strategy=fallback-on-replace"];
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiApply(<vscode.Uri>editor.document.uri, false, true, kappArguments);
		}

		return korgiApply(<vscode.Uri>uri, false, true, kappArguments);
	});

	context.subscriptions.push(applyWithRecreateOverrideOwnershipCommand);

	const deleteCommand = vscode.commands.registerCommand('lazykorgi.delete', (uri: vscode.TextDocument | vscode.Uri) => {
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return korgiDelete(<vscode.Uri>editor.document.uri);
		}

		return korgiDelete(<vscode.Uri>uri);
	});

	context.subscriptions.push(deleteCommand);
}

export function deactivate() {}