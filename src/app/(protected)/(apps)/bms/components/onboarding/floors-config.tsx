"use client"

import { useState } from "react"
import { Button } from "@/shadcn/ui/button"
import { PlusCircle, Trash2, Pencil, Copy } from "lucide-react"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Switch } from "@/shadcn/ui/switch"
import { Badge } from "@/shadcn/ui/badge"

interface Floor {
  id: string
  name: string
  level: number
  area: number
  type: string
  hasVAV: boolean
  hasLighting: boolean
  hasAccess: boolean
}

export function FloorsConfig() {
  const [floors, setFloors] = useState<Floor[]>([
    { 
      id: '1', 
      name: 'Ground Floor', 
      level: 1, 
      area: 10000, 
      type: 'office',
      hasVAV: true,
      hasLighting: true,
      hasAccess: true
    },
    { 
      id: '2', 
      name: 'First Floor', 
      level: 2, 
      area: 9500, 
      type: 'office',
      hasVAV: true,
      hasLighting: true,
      hasAccess: true
    },
    { 
      id: '3', 
      name: 'Second Floor', 
      level: 3, 
      area: 9500, 
      type: 'office',
      hasVAV: true,
      hasLighting: true,
      hasAccess: true
    },
  ])
  
  const [newFloor, setNewFloor] = useState<Omit<Floor, 'id'>>({
    name: '',
    level: 1,
    area: 0,
    type: 'office',
    hasVAV: true,
    hasLighting: true,
    hasAccess: false
  })
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [floorToDelete, setFloorToDelete] = useState<string | null>(null)
  
  const handleAddFloor = () => {
    const id = Date.now().toString()
    setFloors([...floors, { id, ...newFloor }])
    setNewFloor({
      name: '',
      level: floors.length + 1,
      area: 0,
      type: 'office',
      hasVAV: true,
      hasLighting: true,
      hasAccess: false
    })
    setDialogOpen(false)
  }
  
  const handleEditFloor = () => {
    if (editingFloor) {
      setFloors(floors.map(floor => 
        floor.id === editingFloor.id ? editingFloor : floor
      ))
      setEditingFloor(null)
      setDialogOpen(false)
    }
  }
  
  const handleDuplicateFloor = (floor: Floor) => {
    const newId = Date.now().toString()
    const duplicatedFloor = {
      ...floor,
      id: newId,
      name: `${floor.name} (Copy)`,
      level: floor.level + 0.1,
    }
    
    setFloors([...floors, duplicatedFloor].sort((a, b) => a.level - b.level))
  }
  
  const confirmDeleteFloor = (id: string) => {
    setFloorToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteFloor = () => {
    if (floorToDelete) {
      setFloors(floors.filter(floor => floor.id !== floorToDelete))
      setFloorToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  
  const openEditDialog = (floor: Floor) => {
    setEditingFloor(floor)
    setDialogOpen(true)
  }
  
  const handleNewFloorChange = (field: keyof Omit<Floor, 'id'>, value: any) => {
    setNewFloor({ ...newFloor, [field]: value })
  }
  
  const handleEditingFloorChange = (field: keyof Floor, value: any) => {
    if (editingFloor) {
      setEditingFloor({ ...editingFloor, [field]: value })
    }
  }
  
  const getFloorTypeBadge = (type: string) => {
    switch (type) {
      case 'office':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Office</Badge>
      case 'residential':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Residential</Badge>
      case 'retail':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Retail</Badge>
      case 'parking':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">Parking</Badge>
      case 'mechanical':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Mechanical</Badge>
      case 'mixed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Mixed Use</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Building Floors</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" onClick={() => setEditingFloor(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Floor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingFloor ? 'Edit Floor' : 'Add New Floor'}</DialogTitle>
              <DialogDescription>
                {editingFloor 
                  ? 'Update the floor details below.'
                  : 'Enter the details of the new floor to add it to the building.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Floor Name</Label>
                  <Input 
                    id="name" 
                    value={editingFloor ? editingFloor.name : newFloor.name}
                    onChange={(e) => {
                      if (editingFloor) {
                        handleEditingFloorChange('name', e.target.value)
                      } else {
                        handleNewFloorChange('name', e.target.value)
                      }
                    }}
                    placeholder="e.g. Ground Floor" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Floor Level</Label>
                  <Input 
                    id="level" 
                    type="number"
                    value={editingFloor ? editingFloor.level : newFloor.level}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      if (editingFloor) {
                        handleEditingFloorChange('level', value)
                      } else {
                        handleNewFloorChange('level', value)
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Floor Area (sq ft)</Label>
                  <Input 
                    id="area" 
                    type="number"
                    value={editingFloor ? editingFloor.area : newFloor.area}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (editingFloor) {
                        handleEditingFloorChange('area', value)
                      } else {
                        handleNewFloorChange('area', value)
                      }
                    }}
                    placeholder="e.g. 10000" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Floor Type</Label>
                  <Select 
                    value={editingFloor ? editingFloor.type : newFloor.type}
                    onValueChange={(value) => {
                      if (editingFloor) {
                        handleEditingFloorChange('type', value)
                      } else {
                        handleNewFloorChange('type', value)
                      }
                    }}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select floor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Building Systems</h4>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="vav-switch" className="flex flex-col space-y-1">
                    <span>VAV System</span>
                    <span className="font-normal text-xs text-muted-foreground">Variable Air Volume HVAC</span>
                  </Label>
                  <Switch 
                    id="vav-switch"
                    checked={editingFloor ? editingFloor.hasVAV : newFloor.hasVAV}
                    onCheckedChange={(checked) => {
                      if (editingFloor) {
                        handleEditingFloorChange('hasVAV', checked)
                      } else {
                        handleNewFloorChange('hasVAV', checked)
                      }
                    }}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="lighting-switch" className="flex flex-col space-y-1">
                    <span>Lighting Controls</span>
                    <span className="font-normal text-xs text-muted-foreground">Smart lighting system</span>
                  </Label>
                  <Switch 
                    id="lighting-switch"
                    checked={editingFloor ? editingFloor.hasLighting : newFloor.hasLighting}
                    onCheckedChange={(checked) => {
                      if (editingFloor) {
                        handleEditingFloorChange('hasLighting', checked)
                      } else {
                        handleNewFloorChange('hasLighting', checked)
                      }
                    }}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="access-switch" className="flex flex-col space-y-1">
                    <span>Access Control</span>
                    <span className="font-normal text-xs text-muted-foreground">Security and access system</span>
                  </Label>
                  <Switch 
                    id="access-switch"
                    checked={editingFloor ? editingFloor.hasAccess : newFloor.hasAccess}
                    onCheckedChange={(checked) => {
                      if (editingFloor) {
                        handleEditingFloorChange('hasAccess', checked)
                      } else {
                        handleNewFloorChange('hasAccess', checked)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={editingFloor ? handleEditFloor : handleAddFloor}>
                {editingFloor ? 'Save Changes' : 'Add Floor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Floor Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Area (sq ft)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Systems</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No floors added yet. Click "Add Floor" to get started.
                </TableCell>
              </TableRow>
            ) : (
              floors
                .sort((a, b) => a.level - b.level)
                .map((floor) => (
                <TableRow key={floor.id}>
                  <TableCell className="font-medium">{floor.name}</TableCell>
                  <TableCell>{floor.level}</TableCell>
                  <TableCell>{floor.area.toLocaleString()}</TableCell>
                  <TableCell>{getFloorTypeBadge(floor.type)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {floor.hasVAV && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          HVAC
                        </Badge>
                      )}
                      {floor.hasLighting && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Lighting
                        </Badge>
                      )}
                      {floor.hasAccess && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          Access
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(floor)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateFloor(floor)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteFloor(floor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this floor and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFloor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}