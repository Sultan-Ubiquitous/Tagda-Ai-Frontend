import { useEffect, useState } from "react";
import { JSX } from "react";
import { useStepStore } from "@/store";
import { Step, StepType, FileItem } from "@/types";



const CodeWorkspace = () => {
  const { steps, setSteps } = useStepStore();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  // Build file structure from steps
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            // in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
      }))
    }
  }, [steps]);

  // Auto-select first file when files are loaded
  useEffect(() => {
    if (files.length > 0 && !selectedFilePath) {
      const firstFile = findFirstFile(files);
      if (firstFile) {
        setSelectedFilePath(firstFile.path);
        
        // Auto-open parent folders
        const folders = extractParentFolders(firstFile.path);
        setOpenFolders(new Set(folders));
      }
    }
  }, [files, selectedFilePath]);

  const findFirstFile = (nodes: FileItem[]): FileItem | null => {
    for (const node of nodes) {
      if (node.type === "file") return node;
      if (node.children) {
        const result = findFirstFile(node.children);
        if (result) return result;
      }
    }
    return null;
  };

  const extractParentFolders = (filePath: string): string[] => {
    const parts = filePath.split("/").filter(Boolean);
    const folders: string[] = [];
    let current = "";
    
    for (let i = 0; i < parts.length - 1; i++) {
      current += "/" + parts[i];
      folders.push(current);
    }
    
    return folders;
  };

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleSelectFile = (path: string) => {
    setSelectedFilePath(path);
  };

  const handleChange = (value: string) => {
    setFiles(prevFiles => updateFileContent(prevFiles, selectedFilePath, value));
  };

  const updateFileContent = (nodes: FileItem[], targetPath: string, newContent: string): FileItem[] => {
    return nodes.map(node => {
      if (node.path === targetPath && node.type === "file") {
        return { ...node, content: newContent };
      }
      if (node.children) {
        return { ...node, children: updateFileContent(node.children, targetPath, newContent) };
      }
      return node;
    });
  };

  const findFile = (nodes: FileItem[], path: string): FileItem | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const result = findFile(node.children, path);
        if (result) return result;
      }
    }
    return null;
  };

  const selectedFile = findFile(files, selectedFilePath);
  const selectedFileName = selectedFile?.name ?? "No file selected";
  const selectedContent = selectedFile?.content ?? "";

  const getIndentClass = (depth: number) => {
    const classes = ["pl-2", "pl-4", "pl-6", "pl-8", "pl-10", "pl-12"];
    return classes[Math.min(depth, classes.length - 1)];
  };

  const renderTree = (nodes: FileItem[], depth = 0): JSX.Element[] => {
    return nodes.map((node) => {
      const isFile = node.type === "file";
      const isFolder = node.type === "folder";
      const isActive = isFile && node.path === selectedFilePath;
      const isOpen = isFolder && openFolders.has(node.path);

      const baseClasses = [
        "w-full text-left text-xs py-1",
        getIndentClass(depth),
        "hover:bg-gray-100",
      ];

      if (isActive) {
        baseClasses.push("bg-black", "text-white", "hover:bg-black");
      }

      return (
        <div key={node.path}>
          <button
            type="button"
            onClick={() =>
              isFolder ? toggleFolder(node.path) : handleSelectFile(node.path)
            }
            className={baseClasses.join(" ")}
          >
            {isFolder && (
              <span className="inline-block mr-1">
                {isOpen ? "▾" : "▸"}
              </span>
            )}
            {!isFolder && <span className="inline-block mr-1">•</span>}
            {node.name}
          </button>

          {isFolder && node.children && isOpen && (
            <div className="border-l border-gray-200 ml-2">
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full w-full bg-white text-black text-xs">
      {/* File nav */}
      <aside className="w-1/4 border-r border-black flex flex-col">
        <div className="border-b border-black px-3 py-2 text-[11px] font-medium uppercase tracking-wide">
          Files
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {files.length > 0 ? (
            renderTree(files)
          ) : (
            <div className="px-3 py-2 text-gray-500 text-xs">
              No files yet
            </div>
          )}
        </div>
      </aside>

      {/* Code editor */}
      <section className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-black px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{selectedFileName}</span>
            {selectedFile && (
              <span className="text-[10px] text-gray-500 border border-gray-300 rounded px-1">
                {selectedFile.name.split('.').pop() || 'txt'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Spaces: 2</span>
            <span>|</span>
            <span>UTF-8</span>
          </div>
        </header>

        {/* Editor area */}
        <div className="flex-1">
          {selectedFile ? (
            <textarea
              value={selectedContent}
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full font-mono text-xs p-3 resize-none focus:outline-none"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a file to edit
            </div>
          )}
        </div>

        {/* Status bar */}
        <footer className="border-t border-black px-3 py-1.5 text-[10px] flex items-center justify-between text-gray-600">
          <span>Tagda AI</span>
          <span>{selectedFile ? "Ready" : "No file selected"}</span>
        </footer>
      </section>
    </div>
  );
};

export default CodeWorkspace;