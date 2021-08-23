import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  //パネルを作成する
  let panelGenerator = vscode.commands.registerCommand('write-on-panel.generate', () => {
    const panel = vscode.window.createWebviewPanel(
      'openPreview',
      'Preview test',
      vscode.ViewColumn.Two,
      {enableScripts: true}
    );
    //エディタの内容を取得
    panel.webview.html = getPanelContent();
    const updateWebview = ()=>{
      panel.webview.html = getPanelContent();
    };

    let activeEditor = vscode.window.activeTextEditor;

    //テキストの変動を検知して更新
    vscode.workspace.onDidChangeTextDocument(event => {
      if (activeEditor && event.document === activeEditor.document){
        updateWebview();
      }
    });

    //カーソル移動を検知して更新
    vscode.window.onDidChangeTextEditorSelection(event => {
      if (activeEditor && event.textEditor === activeEditor){
        updateWebview();
      }
    });
  });
  context.subscriptions.push(panelGenerator);
}

function getPanelContent(){
  let activeEditor = vscode.window.activeTextEditor;
  let text :string = "";
  if (activeEditor){
    text = activeEditor.document.getText();
  }
  return `<!DOCTYPE html>
  <html lang="jp">
    <head>
      <title>Example Webview</title>
    </head>
    <body>
    ${text}
    </body>
  </html> `;
}

export function deactivate() {}
