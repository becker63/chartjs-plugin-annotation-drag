import sys
import json
from itertools import zip_longest
import git
import animation
from termcolor import colored
import os
import subprocess

def cmd(prompt, command):
    print(colored(f"\n{prompt} ",  'green'),end='\n')
    try:
        a = subprocess.check_output(f"cd {os.getcwd()} && {command}", shell=True,stderr=subprocess.STDOUT,)
        #print(a.decode('utf-8'))
    except subprocess.CalledProcessError as e: 
        print(str(e.output.decode('utf-8')), end='') 
    print(colored('done', 'yellow'))
    
  
def iterateversion():
    with open('./package.json') as f:
        data = json.load(f)
    stv = str(int(data['version'].replace('.', '')) + 1)
    news = ''
    for char in stv:
        news = news + char + '.'
    news = news[:-1]

    data['version'] = news
    print(colored('version: ' + news, 'red'))

    with open('./package.json', 'w') as outfile:
        json.dump(data, outfile, indent=2)
        
    return news


clock =  ['-','\\','|','/']

@animation.wait() 
def commitgit(commitname):
    cmd('commiting files...', "git commit -m '" + commitname + "'")
    
@animation.wait() 
def build():
    cmd('building files...', "yarn build")

@animation.wait() 
def addgit():
    cmd('adding files to commit...', 'git add .')
        
@animation.wait() 
def pushgit():
    cmd('pushing files to github...', 'git push origin master')

def prettypushtogithub(version):
    addgit()
    commit = input("enter commit name (passing nothing will pass the version): ")
    if commit == '':
        commitgit(version)
    else:
        commitgit(commit)
    pushgit()
    
    
@animation.wait() 
def pushnpm():
    cmd('pushing files to npm...', 'yarn publish')
    
def checkiflatest():
    if len(subprocess.check_output(f"cd {os.getcwd()} && git diff", shell=True,stderr=subprocess.DEVNULL,)) != 0:
        return 0
    else:
        print(colored('\nno changes to commit', 'red'))
        return 1
    
    
        
if __name__ == '__main__':
    try:
        if (sys.argv[1] == '--npm'):
            iterateversion()
            build()
            pushnpm()
    except IndexError:
        if (checkiflatest() == 0):
            version = iterateversion()
            build()
            prettypushtogithub(version)
            pushnpm()
    print(colored("\nFinished.",'magenta'))


